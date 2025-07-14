import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/mileage_state.dart';

class MileageProvider with ChangeNotifier {
  MileageState _state = MileageState();
  MileageState get state => _state;
  double? _previousMileage;
  String? _selectedVehicle;

  List<String> get availableVehicles => [
    'Audi_retr',
    'Buick Skylark Convertible',
    'Chevrolet El Camino',
    'deole',
    'Dodge M4S Turbo Interceptor',
    'Fuel niso truck',
    'howen',
  ];
  String? get selectedVehicle => _selectedVehicle;

  void setVehicle(String vehicle) {
    _selectedVehicle = vehicle;
    notifyListeners();
  }

  Future<void> fetchMileage() async {
    if (_selectedVehicle == null) {
      _state = _state.copyWith(error: 'Por favor selecciona un vehículo');
      notifyListeners();
      return;
    }

    _state = _state.copyWith(isLoading: true, error: null);
    notifyListeners();

    try {
      final response = await http
          .get(
            Uri.parse(
              'http://localhost:3000/wialon/mileage?vehicleName=${Uri.encodeQueryComponent(_selectedVehicle!)}',
            ),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final mileage = data['mileage'].toDouble();
        String statusMessage;

        if (_previousMileage == null) {
          statusMessage = 'Kilometraje inicial';
        } else if (mileage > _previousMileage!) {
          statusMessage = 'El kilometraje ha aumentado';
        } else {
          statusMessage = 'El kilometraje se mantuvo constante';
        }

        _previousMileage = mileage;
        _state = _state.copyWith(
          mileage: mileage,
          isLoading: false,
          statusMessage: statusMessage,
        );
      } else {
        throw Exception(
          'Error en la solicitud: ${response.statusCode} - ${response.reasonPhrase}',
        );
      }
    } catch (e) {
      _state = _state.copyWith(
        isLoading: false,
        error: 'Error al consultar el kilometraje: $e',
      );
    }
    notifyListeners();
  }
}
