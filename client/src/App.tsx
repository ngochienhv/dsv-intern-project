import "./css/App.css";
import React from "react";
import HomePage from "./pages/homePage";
import ArticlePage from "./pages/articlePage";
import EditorPage from "./pages/editorPage";
import SignupPage from "./pages/signupPage";
import SigninPage from "./pages/signinPage";
import ProfilePage from "./pages/profilePage";
import NewPostPage from "./pages/newPostPage";
import {
    MantineProvider,
    ColorSchemeProvider,
    ColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/general/others/privateRoute";

function App() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "mantine-color-scheme",
        defaultValue: "light",
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = () =>
        setColorScheme((colorScheme) =>
            colorScheme === "dark" ? "light" : "dark"
        );

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{
                    colorScheme,
                    colors: {
                        // override dark colors to change them for all components
                        dark: [
                            "#d5d7e0",
                            "#acaebf",
                            "#8c8fa3",
                            "#666980",
                            "#4d4f66",
                            "#34354a",
                            "#2b2c3d",
                            "#1A1B2B",
                            "#0c0d21",
                            "#01010a",
                        ],
                    },
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<SigninPage />} />
                    <Route path="/register" element={<SignupPage />} />
                    <Route
                        path="/article/:slug/:id"
                        element={<ArticlePage />}
                    />
                    <Route
                        path="/profile/:username"
                        element={<ProfilePage other={true} />}
                    />
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/editor" element={<EditorPage />} />
                        <Route
                            path="/write/:article_id"
                            element={<NewPostPage />}
                        />
                        <Route
                            path="/:username"
                            element={<ProfilePage other={false} />}
                        />
                    </Route>
                    <Route path="*" element={<h1>Page not found</h1>} />
                </Routes>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

export default App;
