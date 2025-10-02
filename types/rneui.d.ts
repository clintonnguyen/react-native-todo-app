declare module "@rneui/themed" {
  import { ComponentType } from "react";
  import { TextInputProps, TouchableOpacityProps } from "react-native";

  export interface InputProps extends TextInputProps {
    label?: string;
    leftIcon?: { type: string; name: string };
    rightIcon?: { type: string; name: string };
    errorMessage?: string;
    containerStyle?: any;
    inputContainerStyle?: any;
    labelStyle?: any;
    errorStyle?: any;
    disabled?: boolean;
  }

  export interface ButtonProps extends TouchableOpacityProps {
    title?: string;
    loading?: boolean;
    disabled?: boolean;
    buttonStyle?: any;
    titleStyle?: any;
    containerStyle?: any;
  }

  export const Input: ComponentType<InputProps>;
  export const Button: ComponentType<ButtonProps>;
}
