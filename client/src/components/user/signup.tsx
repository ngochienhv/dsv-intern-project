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
    useMantineTheme,
    Card,
    Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDocumentTitle, useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import "../../css/signin_signup.css";
import axios from "axios";
import { AlertCircle, ArrowBack } from "tabler-icons-react";
import AppShell from "../general/layout/appShell";
import Headers from "../general/layout/header";
import Footers from "../general/layout/footer";

export default function Signup() {
    const theme = useMantineTheme();
    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const navigate = useNavigate();
    const { width } = useViewportSize();
    useDocumentTitle("Register - BBlog");
    const form = useForm({
        initialValues: {
            firstname: "",
            lastname: "",
            password: "",
            repassword: "",
            email: "",
        },

        validate: {
            firstname: (value) =>
                /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/.test(
                    value
                )
                    ? null
                    : "Invalid first name",
            lastname: (value) =>
                /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/.test(
                    value
                )
                    ? null
                    : "Invalid last name",
            password: (value) =>
                value.length === 0
                    ? "Invalid password"
                    : value.length < 8
                    ? "password must be at least 8 characters"
                    : null,
            repassword: (value, values) =>
                value !== values.password ? "Password not the same" : null,
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
        },
    });

    const handleSignup = async (values: {
        firstname: string;
        lastname: string;
        password: string;
        repassword: string;
        email: string;
    }) => {
        setVisible(true);

        const body = {
            email: values.email,
            firstname: values.firstname,
            lastname: values.lastname,
            password: values.password,
        };

        await axios
            .post("http://localhost:5000/api/users", body)
            .then((response) => {
                console.log(response);
                localStorage.setItem("user", JSON.stringify(response.data));
                setVisible(false);
                setAlert(false);
                navigate("/");
            })
            .catch((error) => {
                console.log(error.response);
                setMessage(error.response.data);
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
                mx="auto"
                className="form-signin-container"
                id="form_signup_1"
                size="xs"
            >
                <Card shadow="lg">
                    <LoadingOverlay visible={visible} />
                    <Text
                        style={
                            width > 768 ? { fontSize: 34 } : { fontSize: 24 }
                        }
                        weight={500}
                    >
                        Create new account
                    </Text>
                    <Space h="md" />
                    <form
                        onSubmit={form.onSubmit((values) =>
                            handleSignup(values)
                        )}
                    >
                        <Group grow={true}>
                            <TextInput
                                label="First name"
                                placeholder="your first name"
                                {...form.getInputProps("firstname")}
                                className="form-username-input"
                            />
                            <TextInput
                                label="Last name"
                                placeholder="your last name"
                                {...form.getInputProps("lastname")}
                                className="form-username-input"
                            />
                        </Group>
                        <Space h="md" />
                        <TextInput
                            label="Email"
                            placeholder="email"
                            {...form.getInputProps("email")}
                            className="form-username-input"
                        />
                        <Space h="md" />
                        <PasswordInput
                            label="Password"
                            placeholder="password"
                            {...form.getInputProps("password")}
                            className="form-password-input"
                            onPaste={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                            onCopy={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                        />
                        <Space h="md" />
                        <PasswordInput
                            label="Re-enter Password"
                            placeholder="password"
                            {...form.getInputProps("repassword")}
                            className="form-password-input"
                            onPaste={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                            onCopy={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                        />
                        <Space h="md" />
                        {alert ? (
                            <>
                                <Alert
                                    icon={<AlertCircle size={16} />}
                                    title="Can't create new account"
                                    color="red"
                                    style={{ textAlign: "left" }}
                                >
                                    {message}
                                </Alert>
                                <Space h="md" />
                            </>
                        ) : null}
                        <Button
                            type="submit"
                            color="dark"
                            className="form-signin-submit-btn"
                            fullWidth
                        >
                            SIGN UP
                        </Button>
                        <Space h="sm" />
                        <Text color="gray">
                            Already have an account? Sign in now{" "}
                            <Link
                                to="/login"
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
