import { supabase } from "../config/supabase.client";
import { RegisterRequest, LoginRequest } from "../types/auth.types";
import { JwtUtils } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/hash_password";
import { BadRequestError } from "../middlewares/error.middleware";

export const AuthService = {
  login: async (data: LoginRequest) => {
    const { email, password } = data;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid email or password");
    }

    const access_token = JwtUtils.generateAccessToken({
      user_id: user.id,
    });

    const {
      password: _,
      id: __,
      created_at: ___,
      email: ____,
      ...userWithoutSensitive
    } = user;

    return {
      user: userWithoutSensitive,
      access_token,
    };
  },

  register: async (data: RegisterRequest) => {
    const { email, password, first_name, last_name } = data;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      throw new BadRequestError("Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        first_name,
        last_name,
      })
      .select()
      .single();

    if (error || !user) {
      throw new BadRequestError("Failed to register user");
    }

    // Optional: auto-login after register
    const access_token = JwtUtils.generateAccessToken({
      user_id: user.id,
    });

    const {
      password: _,
      id: __,
      created_at: ___,
      email: ____,
      ...userWithoutSensitive
    } = user;

    return {
      user: userWithoutSensitive,
      access_token,
    };
  },
};
