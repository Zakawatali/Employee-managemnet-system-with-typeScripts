import { ReactNode } from "react";
interface UserInfoContextType {
    user: any;
    setUser: (user: any) => void;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => void;
}
export declare const UserInfoContext: import("react").Context<UserInfoContextType>;
export declare const UserInfoProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export {};
