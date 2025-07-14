class MileageState {
  final double? mileage;
  final bool isLoading;
  final String? error;
  final String? statusMessage;

  MileageState({
    this.mileage,
    this.isLoading = false,
    this.error,
    this.statusMessage,
  });

  MileageState copyWith({
    double? mileage,
    bool? isLoading,
    String? error,
    String? statusMessage,
  }) {
    return MileageState(
      mileage: mileage ?? this.mileage,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      statusMessage: statusMessage ?? this.statusMessage,
    );
  }
}
