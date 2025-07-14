import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:animate_do/animate_do.dart';
import '../providers/mileage_provider.dart';

class MileageScreen extends StatelessWidget {
  const MileageScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mileageProvider = Provider.of<MileageProvider>(context);
    final state = mileageProvider.state;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Wialon Mileage',
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: Colors.white,
            fontSize: 24,
          ),
        ),
        backgroundColor: Theme.of(context).primaryColor,
        elevation: 0,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF121212), Color(0xFF1A237E)],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Dropdown
              FadeInDown(
                duration: const Duration(milliseconds: 500),
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: DropdownButton<String>(
                      value: mileageProvider.selectedVehicle,
                      hint: const Text(
                        'Selecciona un vehículo',
                        style: TextStyle(color: Colors.white70),
                      ),
                      isExpanded: true,
                      dropdownColor: const Color(0xFF1E1E1E),
                      items:
                          mileageProvider.availableVehicles
                              .map(
                                (vehicle) => DropdownMenuItem(
                                  value: vehicle,
                                  child: Text(
                                    vehicle,
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                ),
                              )
                              .toList(),
                      onChanged: (value) {
                        mileageProvider.setVehicle(value!);
                      },
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Botón Consultar
              FadeInUp(
                duration: const Duration(milliseconds: 500),
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.directions_car, size: 24),
                  label: const Text('Consultar Kilometraje'),
                  onPressed: mileageProvider.fetchMileage,
                ),
              ),
              const SizedBox(height: 20),
              // Resultado o Estado
              Expanded(
                child: Center(
                  child: FadeIn(
                    duration: const Duration(milliseconds: 500),
                    child:
                        state.isLoading
                            ? Spin(
                              duration: const Duration(milliseconds: 1000),
                              child: const CircularProgressIndicator(
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Color(0xFF3F51B5),
                                ),
                              ),
                            )
                            : state.error != null
                            ? Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(
                                  'Error: ${state.error}',
                                  style: const TextStyle(
                                    color: Colors.redAccent,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            )
                            : state.mileage != null
                            ? Card(
                              child: Padding(
                                padding: const EdgeInsets.all(24.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      '${state.mileage!.toStringAsFixed(0)} km',
                                      style: const TextStyle(
                                        fontSize: 36,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF3F51B5),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      state.statusMessage ?? '',
                                      style: const TextStyle(
                                        fontSize: 16,
                                        color: Colors.white70,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Vehículo: ${mileageProvider.selectedVehicle}',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: Colors.white54,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                            : const SizedBox(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
