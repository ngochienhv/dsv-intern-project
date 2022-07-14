import React from "react";
import { Link } from "react-router-dom";
import {
    TextInput,
    Button,
    Container,
    PasswordInput,
    Space,
    Text,
    LoadingOverlay,
    Alert,
    Card,
    useMantineTheme,
    Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDocumentTitle, useViewportSize } from "@mantine/hooks";
import "../../css/signin_signup.css";
import axios from "axios";
import { AlertCircle, ArrowBack } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../general/layout/appShell";
import Headers from "../general/layout/header";
import Footers from "../general/layout/footer";
import { baseUrl } from "../general/others/fetchDataFunctions";
import { GoogleLogin } from "@react-oauth/google";

export default function Signin() {
    const theme = useMantineTheme();
    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const { width } = useViewportSize();
    const navigate = useNavigate();
    useDocumentTitle("Login - BBlog");
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },

        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
            password: (value) =>
                value.length === 0 ? "Invalid password" : null,
        },
    });

    const handleLogin = async (values: { email: string; password: string }) => {
        console.log(values);
        setVisible(true);
        const body = {
            email: values.email,
            password: values.password,
        };

        await axios
            .post(baseUrl + "/users/login", body)
            .then((response) => {
                console.log(response);
                localStorage.setItem("user", JSON.stringify(response.data));
                setAlert(false);
                setVisible(false);
                navigate(-1);
            })
            .catch((error) => {
                console.log(error.response);
                setAlert(true);
                setVisible(false);
            });
    };

    return (
        <AppShell
            theme={theme}
            header={<Headers theme={theme} signin={true} />}
            footer={<Footers />}
            navbar={undefined}
            aside={undefined}
        >
            <Container
                size="xs"
                mx="auto"
                className="form-signin-container"
                id="form_signin_1"
            >
                <Card shadow="lg">
                    <LoadingOverlay visible={visible} />
                    <Text
                        style={
                            width > 768 ? { fontSize: 34 } : { fontSize: 24 }
                        }
                        weight={500}
                    >
                        Welcome back
                    </Text>
                    <Space h="md" />
                    <form
                        onSubmit={form.onSubmit((values) =>
                            handleLogin(values)
                        )}
                    >
                        <TextInput
                            label="Email"
                            placeholder="your_email@email.com"
                            {...form.getInputProps("email")}
                            className="form-username-input"
                        />
                        <Space h="md" />
                        <PasswordInput
                            label="Password"
                            placeholder="password"
                            {...form.getInputProps("password")}
                            className="form-password-input"
                        />
                        <Space h="md" />
                        {alert ? (
                            <>
                                <Alert
                                    icon={<AlertCircle size={16} />}
                                    title="Email or password invalid!"
                                    color="red"
                                    style={{ textAlign: "left" }}
                                >
                                    Your email or password is invalid. Please
                                    try another email or password!
                                </Alert>
                                <Space h="md" />
                            </>
                        ) : null}
                        <Group direction="column">
                            <Button
                                type="submit"
                                color="dark"
                                className="form-signin-submit-btn"
                                fullWidth
                            >
                                SIGN IN
                            </Button>
                            {/* <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    console.log(credentialResponse);
                                }}
                                onError={() => {
                                    console.log("Login Failed");
                                }}
                            /> */}
                        </Group>
                        <Space h="sm" />
                        <Text color="gray">
                            Haven't had an account yet? Sign up now{" "}
                            <Link
                                to="/register"
                                style={{
                                    textDecoration: "none",
                                    color: "#4dabf7",
                                }}
                            >
                                here
                            </Link>
                        </Text>
                        <Link
                            to="/"
                            style={{
                                textDecoration: "none",
                                color: "#4dabf7",
                            }}
                        >
                            <ArrowBack
                                size={24}
                                strokeWidth={2}
                                color={"#4dabf7"}
                                style={{
                                    marginTop: 5,
                                }}
                            />
                            Home
                        </Link>
                    </form>
                </Card>
            </Container>
        </AppShell>
    );
}
