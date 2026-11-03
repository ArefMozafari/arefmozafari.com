import 'package:flutter/material.dart';
import 'package:flutter_pw_validator/flutter_pw_validator.dart';
import 'package:validator_demo/demo_theme.dart';

void main() => runApp(const DemoApp());

/// The flutter_pw_validator widget under one password field, nothing else.
/// Lives inside the phone frame on arefmozafari.com.
class DemoApp extends StatelessWidget {
  /// Creates the demo app.
  const DemoApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Flutter Password Validator demo',
    debugShowCheckedModeBanner: false,
    theme: demoTheme,
    home: const DemoPage(),
  );
}

/// The one screen: a focused password field and the live rules under it.
class DemoPage extends StatefulWidget {
  /// Creates the demo page.
  const DemoPage({super.key});

  @override
  State<DemoPage> createState() => _DemoPageState();
}

class _DemoPageState extends State<DemoPage> {
  static const double _pagePadding = 12;
  static const double _fieldGap = 10;
  static const double _ruleSpacing = 8;
  static const double _barThickness = 3;
  static const double _ruleFontSize = 11;
  static const double _fieldFontSize = 13;

  final TextEditingController _controller = TextEditingController();

  /// The same policy the package README shows, plus the common-password blocklist.
  final PasswordRules _rules = const PasswordRules(
    minLength: 8,
    uppercase: 1,
    digits: 1,
    special: 1,
    custom: [CommonPasswordsRule()],
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(_pagePadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _controller,
              autocorrect: false,
              enableSuggestions: false,
              style: const TextStyle(fontSize: _fieldFontSize),
              decoration: const InputDecoration(
                labelText: 'Password',
                isDense: true,
              ),
            ),
            const SizedBox(height: _fieldGap),
            FlutterPwValidator(
              controller: _controller,
              rules: _rules,
              successColor: DemoColors.green,
              defaultColor: DemoColors.inkMuted,
              spacing: _ruleSpacing,
              barThickness: _barThickness,
              textStyle: const TextStyle(fontSize: _ruleFontSize),
            ),
          ],
        ),
      ),
    ),
  );
}
