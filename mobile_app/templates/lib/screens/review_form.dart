import 'package:flutter/material.dart';
import '../services/api.dart';

class ReviewFormScreen extends StatefulWidget {
  const ReviewFormScreen({super.key});
  @override
  State<ReviewFormScreen> createState() => _ReviewFormScreenState();
}

class _ReviewFormScreenState extends State<ReviewFormScreen> {
  final vehicleCtl = TextEditingController();
  final driverCtl = TextEditingController();
  String? msg;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nueva revisión')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: vehicleCtl, decoration: const InputDecoration(labelText: 'ID Vehículo')),
            TextField(controller: driverCtl, decoration: const InputDecoration(labelText: 'ID Conductor')),
            const SizedBox(height: 12),
            ElevatedButton(onPressed: () async {
              final r = await Api.createReview(vehicleCtl.text, driverCtl.text);
              setState(()=> msg = r);
            }, child: const Text('Registrar revisión (cobro automático)')),
            const SizedBox(height: 12),
            if (msg!=null) Text(msg!),
          ],
        ),
      ),
    );
  }
}
