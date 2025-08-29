import 'package:flutter/material.dart';
import '../services/api.dart';
import 'review_form.dart';
import 'saldo.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailCtl = TextEditingController();
  final passCtl = TextEditingController();
  String? error;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('PreopAI - Iniciar sesión')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: emailCtl, decoration: const InputDecoration(labelText: 'Email')),
            TextField(controller: passCtl, decoration: const InputDecoration(labelText: 'Contraseña'), obscureText: true),
            const SizedBox(height: 12),
            if (error!=null) Text(error!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 12),
            Row(children: [
              ElevatedButton(onPressed: () async {
                final ok = await Api.login(emailCtl.text, passCtl.text);
                if(!ok){ setState(()=> error='Credenciales inválidas'); return; }
                if(!mounted) return;
                Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ReviewFormScreen()));
              }, child: const Text('Entrar')),
              const SizedBox(width: 12),
              ElevatedButton(onPressed: (){
                Navigator.of(context).push(MaterialPageRoute(builder: (_)=> const SaldoScreen()));
              }, child: const Text('Ver saldo'))
            ]),
          ],
        ),
      ),
    );
  }
}
