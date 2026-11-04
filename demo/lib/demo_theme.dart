import 'package:flutter/material.dart';

/// Colours of the site's token layer, so the demo matches the page around it.
abstract final class DemoColors {
  static const Color canvas = Color(0xFFF5F1E8);
  static const Color ink = Color(0xFF15120C);
  static const Color inkMuted = Color(0xFF5A5244);
  static const Color gold = Color(0xFFE0B95C);
  static const Color green = Color(0xFF3F8A4C);
}

/// Size of the password field's text and its label. The phone frame shows the demo at roughly
/// half size, so the type runs smaller than the page's own small text to sit level with the
/// screenshots in the other frames.
const double demoFieldFontSize = 11;

/// The one theme of the demo: cream canvas, charcoal ink, gold for the bar.
final ThemeData demoTheme = ThemeData(
  useMaterial3: true,
  scaffoldBackgroundColor: DemoColors.canvas,
  colorScheme: ColorScheme.fromSeed(
    seedColor: DemoColors.gold,
    primary: DemoColors.ink,
    surface: DemoColors.canvas,
    onSurface: DemoColors.ink,
    onSurfaceVariant: DemoColors.inkMuted,
  ),
  inputDecorationTheme: const InputDecorationTheme(
    border: OutlineInputBorder(
      borderSide: BorderSide(color: DemoColors.ink, width: 1.5),
    ),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: DemoColors.ink, width: 1.5),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: DemoColors.ink, width: 2),
    ),
    labelStyle: TextStyle(
      color: DemoColors.inkMuted,
      fontSize: demoFieldFontSize,
    ),
    floatingLabelStyle: TextStyle(
      color: DemoColors.ink,
      fontSize: demoFieldFontSize,
    ),
  ),
);
