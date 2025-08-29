import 'package:flutter/material.dart';
import 'screens/login.dart';

void main() {
  runApp(const PreopAI());
}

class PreopAI extends StatelessWidget {
  const PreopAI({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PreopAI',
      theme: ThemeData(useMaterial3: true),
      home: const LoginScreen(),
    );
  }
}
