/**
 * Concept: Frontend Validation & Client Logic Verification Test Suite.
 * Why: Ensures that mandatory Assignment 8 requirements (such as password security rules:
 *      min 6 chars, 1 uppercase, 1 lowercase) are strictly enforced prior to network submission.
 * How: Directly invokes Zod schemas and assertions against test fixtures.
 * Example: Verifies that "pass123" is rejected for missing uppercase, while "SecurePass123" is accepted.
 */

import { registerSchema, loginSchema } from "../lib/validators/auth.js";

function runClientVerificationTests() {
  console.log("\n=======================================================");
  console.log("       STARTING CLIENT VALIDATION UNIT TESTS           ");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  // TEST 1: Valid registration payload with conforming password
  try {
    const validResult = registerSchema.safeParse({
      name: "Tanjim Hasan",
      email: "tanjim@example.com",
      password: "ValidPassword123",
      confirmPassword: "ValidPassword123",
    });

    if (validResult.success) {
      console.log("✅ TEST 1 PASSED: Valid registration credentials passed validation.");
      passed++;
    } else {
      throw new Error(`Unexpected failure: ${JSON.stringify(validResult.error.format())}`);
    }
  } catch (err: any) {
    console.error("❌ TEST 1 FAILED:", err.message);
    failed++;
  }

  // TEST 2: Password missing uppercase letter
  try {
    const noUpperResult = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    if (!noUpperResult.success) {
      const issues = noUpperResult.error.issues || (noUpperResult.error as any).errors || [];
      const messages = issues.map((e: any) => e.message);
      if (messages.some((m: string) => m.toLowerCase().includes("uppercase"))) {
        console.log("✅ TEST 2 PASSED: Missing uppercase letter correctly rejected.");
        passed++;
      } else {
        throw new Error("Rejected, but did not cite missing uppercase requirement.");
      }
    } else {
      throw new Error("Password without uppercase was incorrectly accepted.");
    }
  } catch (err: any) {
    console.error("❌ TEST 2 FAILED:", err.message);
    failed++;
  }

  // TEST 3: Password missing lowercase letter
  try {
    const noLowerResult = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "PASSWORD123",
      confirmPassword: "PASSWORD123",
    });

    if (!noLowerResult.success) {
      const issues = noLowerResult.error.issues || (noLowerResult.error as any).errors || [];
      const messages = issues.map((e: any) => e.message);
      if (messages.some((m: string) => m.toLowerCase().includes("lowercase"))) {
        console.log("✅ TEST 3 PASSED: Missing lowercase letter correctly rejected.");
        passed++;
      } else {
        throw new Error("Rejected, but did not cite missing lowercase requirement.");
      }
    } else {
      throw new Error("Password without lowercase was incorrectly accepted.");
    }
  } catch (err: any) {
    console.error("❌ TEST 3 FAILED:", err.message);
    failed++;
  }

  // TEST 4: Password too short (< 6 characters)
  try {
    const shortResult = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Ab1",
      confirmPassword: "Ab1",
    });

    if (!shortResult.success) {
      const issues = shortResult.error.issues || (shortResult.error as any).errors || [];
      const messages = issues.map((e: any) => e.message);
      if (messages.some((m: string) => m.includes("6 characters"))) {
        console.log("✅ TEST 4 PASSED: Password < 6 characters correctly rejected.");
        passed++;
      } else {
        throw new Error("Rejected, but did not cite minimum length requirement.");
      }
    } else {
      throw new Error("Short password was incorrectly accepted.");
    }
  } catch (err: any) {
    console.error("❌ TEST 4 FAILED:", err.message);
    failed++;
  }

  // TEST 5: Password and ConfirmPassword mismatch
  try {
    const mismatchResult = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "ValidPass123",
      confirmPassword: "DifferentPass123",
    });

    if (!mismatchResult.success) {
      const issues = mismatchResult.error.issues || (mismatchResult.error as any).errors || [];
      const messages = issues.map((e: any) => e.message);
      if (messages.some((m: string) => m.includes("Passwords do not match"))) {
        console.log("✅ TEST 5 PASSED: Password mismatch correctly rejected.");
        passed++;
      } else {
        throw new Error("Rejected, but did not cite password mismatch.");
      }
    } else {
      throw new Error("Mismatched passwords were incorrectly accepted.");
    }
  } catch (err: any) {
    console.error("❌ TEST 5 FAILED:", err.message);
    failed++;
  }

  // TEST 6: Valid Login Schema parsing
  try {
    const validLogin = loginSchema.safeParse({
      email: "volunteer@communityconnect.org",
      password: "Password123",
    });

    if (validLogin.success) {
      console.log("✅ TEST 6 PASSED: Valid login credentials parsed cleanly.");
      passed++;
    } else {
      throw new Error("Valid login schema was rejected.");
    }
  } catch (err: any) {
    console.error("❌ TEST 6 FAILED:", err.message);
    failed++;
  }

  console.log("\n=======================================================");
  console.log(`CLIENT TESTS FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  process.exit(failed > 0 ? 1 : 0);
}

runClientVerificationTests();
