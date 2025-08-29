import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class Api {
  static String base = const String.fromEnvironment('API_BASE', defaultValue: 'http://localhost/api');
  static String companyId = const String.fromEnvironment('COMPANY_ID', defaultValue: '');

  static Future<bool> login(String email, String password) async {
    final r = await http.post(Uri.parse('$base/auth/login'),
      headers: {'Content-Type':'application/json'},
      body: jsonEncode({'email':email, 'password':password}));
    if(r.statusCode==200){
      final data = jsonDecode(r.body);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      return true;
    }
    return false;
  }

  static Future<String> balance() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';
    final r = await http.get(Uri.parse('$base/wallet/balance'),
      headers: {'Authorization': 'Bearer $token', 'x-company-id': companyId});
    return r.body;
  }

  static Future<String> createReview(String vehicleId, String driverId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';
    final r = await http.post(Uri.parse('$base/reviews'),
      headers: {'Authorization': 'Bearer $token', 'Content-Type':'application/json', 'x-company-id': companyId},
      body: jsonEncode({'vehicleId': vehicleId, 'driverId': driverId}));
    return r.body;
  }
}
