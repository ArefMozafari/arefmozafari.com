import 'package:flutter/material.dart';
import 'package:flutter_pw_validator/flutter_pw_validator.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:validator_demo/main.dart';

void main() {
  group('DemoPage', () {
    testWidgets('should show one password field with the validator under it', (
      tester,
    ) async {
      await tester.pumpWidget(const DemoApp());

      expect(find.byType(TextField), findsOneWidget);
      expect(find.byType(FlutterPwValidator), findsOneWidget);
    });

    testWidgets('should not take keyboard focus on load', (tester) async {
      await tester.pumpWidget(const DemoApp());
      await tester.pump();

      final field = tester.widget<TextField>(find.byType(TextField));
      expect(field.autofocus, isFalse);
      expect(
        tester
            .state<EditableTextState>(find.byType(EditableText))
            .widget
            .focusNode
            .hasFocus,
        isFalse,
      );
    });

    testWidgets('should list the five rules the demo enforces', (tester) async {
      await tester.pumpWidget(const DemoApp());

      expect(find.textContaining('8'), findsOneWidget);
      expect(
        find.textContaining('uppercase', findRichText: true),
        findsOneWidget,
      );
      expect(find.textContaining('digit', findRichText: true), findsOneWidget);
      expect(
        find.textContaining('special', findRichText: true),
        findsOneWidget,
      );
      expect(find.textContaining('common', findRichText: true), findsOneWidget);
    });

    testWidgets('should accept a password that meets every rule', (
      tester,
    ) async {
      await tester.pumpWidget(const DemoApp());

      await tester.enterText(find.byType(TextField), 'Tr0ub4dor&3');
      await tester.pumpAndSettle();

      final state = tester.state<FlutterPwValidatorState>(
        find.byType(FlutterPwValidator),
      );
      expect(state.validate(), isTrue);
    });
  });
}
