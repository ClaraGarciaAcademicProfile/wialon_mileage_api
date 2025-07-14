import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class WialonService {
  private readonly apiUrl: string;
  private readonly token: string;
  private axiosInstance: AxiosInstance;
  private eid: string | null = null;
  private sessionTimestamp: number | null = null;
  private readonly sessionTimeout = 30 * 60 * 1000; // 30 minutos
  private readonly requestTimeout = 30 * 1000; // 30 segundos
  private lastMileage: { [vehicleName: string]: number } = {}; // Caché de kilometraje

  constructor(private configService: ConfigService) {
    const apiUrl = this.configService.get<string>('WIALON_API_URL');
    const token = this.configService.get<string>('WIALON_TOKEN');

    if (!apiUrl || !token) {
      throw new Error(
        'Missing required environment variables: WIALON_API_URL and WIALON_TOKEN must be defined in .env'
      );
    }

    this.apiUrl = apiUrl;
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      timeout: this.requestTimeout,
    });
  }

  private isSessionExpired(): boolean {
    if (!this.sessionTimestamp) return true;
    const currentTime = Date.now();
    const elapsed = currentTime - this.sessionTimestamp;
    return elapsed > this.sessionTimeout;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(): Promise<{ eid: string }> {
    try {
      const params = {
        svc: 'token/login',
        params: JSON.stringify({ token: this.token }),
      };

      const response = await this.axiosInstance.post('', null, {
        params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      console.log('Login response:', JSON.stringify(response.data, null, 2));

      const { eid } = response.data;
      if (!eid) {
        throw new Error(`Invalid login response: eid=${eid}`);
      }

      console.log('Login successful:');
      console.log(`- eid: ${eid}`);

      this.eid = eid;
      this.sessionTimestamp = Date.now();
      return { eid };
    } catch (error) {
      throw new HttpException(
        `Login failed: ${error.response?.data?.reason || error.message}`,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async getMileage(vehicleName: string, retryCount = 0): Promise<number> {
    const maxRetries = 3;
    const retryDelays = [500, 1000, 2000];

    if (!vehicleName) {
      throw new HttpException(
        'vehicleName is required',
        HttpStatus.BAD_REQUEST
      );
    }

    if (!this.eid || this.isSessionExpired()) {
      await this.login();
    }

    try {
      const params = {
        svc: 'core/search_items',
        params: JSON.stringify({
          spec: {
            itemsType: 'avl_unit',
            propName: 'sys_name',
            propValueMask: vehicleName,
            sortType: 'sys_name',
          },
          force: 1,
          flags: 8193,
          from: 0,
          to: 0,
        }),
        sid: this.eid,
      };

      const response = await this.axiosInstance.post('', null, {
        params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const mileage = response.data.items[0]?.cnm;
      if (!mileage && mileage !== 0) {
        throw new Error(`Mileage not found for vehicle: ${vehicleName}`);
      }

      this.lastMileage[vehicleName] = mileage; // Guardar en caché
      return mileage;
    } catch (error) {
      const errorCode = error.response?.data?.error;
      const errorMessage = error.response?.data?.reason || error.message;

      if (
        (errorCode === 1 || errorCode === 7 || error.code === 'ETIMEDOUT') &&
        retryCount < maxRetries
      ) {
        await this.delay(retryDelays[retryCount]);
        this.eid = null;
        await this.login();
        return this.getMileage(vehicleName, retryCount + 1);
      }

      // Devolver caché si existe
      if (this.lastMileage[vehicleName] !== undefined) {
        return this.lastMileage[vehicleName];
      }

      throw new HttpException(
        `Failed to fetch mileage for ${vehicleName}: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
