import 'package:flutter/material.dart';
import '../services/api.dart';

class SaldoScreen extends StatefulWidget {
  const SaldoScreen({super.key});
  @override
  State<SaldoScreen> createState() => _SaldoScreenState();
}

class _SaldoScreenState extends State<SaldoScreen> {
  String? saldo;
  @override
  void initState() {
    super.initState();
    _load();
  }
  Future<void> _load() async {
    final b = await Api.balance();
    setState(()=> saldo = b);
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saldo')),
      body: Center(child: Text(saldo ?? 'Cargando...')),
    );
  }
}
