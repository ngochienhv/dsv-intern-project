import React from "react";
import {
    Header,
    MediaQuery,
    useMantineColorScheme,
    ActionIcon,
    Group,
    Anchor,
    Box,
    Button,
    Grid,
    MantineTheme,
    Menu,
    Avatar,
    TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { Sun, MoonStars, Logout, UserCircle, News } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import Logo from "../others/logo";
import "../../../css/header.css";
import { Search } from "tabler-icons-react";

type Props = {
    theme: MantineTheme;
    signin: boolean;
};
export default function Headers({ theme, signin }: Props) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [stringValue, setStringValue] = useInputState<string>("");
    const navigate = useNavigate();
    const dark = colorScheme === "dark";

    const anchorStyle = (theme: MantineTheme) => ({
        color:
            theme.colorScheme === "dark"
                ? theme.colors.gray[0]
                : theme.colors.dark[9],
        fontSize: 16,
        transition: "color 0.3s",
        "&:hover": {
            textDecoration: "none",
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.gray[7]
                    : theme.colors.dark[2],
        },
    });

    const btnStyle = (theme: MantineTheme) => ({
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.blue[8]
                : theme.colors.dark[9],
        transition: "background-color 0.3s",
        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.blue[4]
                    : theme.colors.dark[5],
        },
    });

    return (
        <Header height={60} p="md">
            <Grid columns={15}>
                <MediaQuery smallerThan="sm" styles={{ maxWidth: "20%" }}>
                    <Grid.Col
                        xl={3}
                        lg={3}
                        md={3}
                        sm={2}
                        xs={3}
                        style={{ textAlign: "center" }}
                    >
                        <Logo />
                    </Grid.Col>
                </MediaQuery>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Grid.Col xl={6} lg={6} md={6} sm={6} xs={0}>
                        <TextInput
                            placeholder="Search..."
                            rightSection={
                                <Button
                                    variant="subtle"
                                    onClick={() =>
                                        navigate(
                                            `/search?q=${encodeURIComponent(
                                                stringValue
                                            )}`
                                        )
                                    }
                                >
                                    <Search />
                                </Button>
                            }
                            rightSectionWidth={70}
                            radius={10}
                            type="search"
                            value={stringValue}
                            onChange={setStringValue}
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                navigate(
                                    `/search?q=${encodeURIComponent(
                                        stringValue
                                    )}`
                                )
                            }
                        />
                    </Grid.Col>
                </MediaQuery>
                <MediaQuery smallerThan="sm" styles={{ maxWidth: "80%" }}>
                    <Grid.Col xl={6} lg={6} md={5} sm={6} xs={11}>
                        <Box className="header-container-box">
                            <Group
                                direction="row"
                                position="right"
                                spacing={20}
                                style={{ marginTop: -4 }}
                            >
                                <MediaQuery
                                    smallerThan="sm"
                                    styles={{ display: "none" }}
                                >
                                    <Anchor
                                        sx={anchorStyle}
                                        component={Link}
                                        to="/"
                                    >
                                        Home
                                    </Anchor>
                                </MediaQuery>
                                {user.token ? (
                                    <>
                                        <Menu
                                            shadow="md"
                                            closeOnScroll={true}
                                            size="sm"
                                            control={
                                                <Button
                                                    sx={btnStyle}
                                                    radius={30}
                                                >
                                                    <Group spacing={5}>
                                                        <Avatar
                                                            radius={50}
                                                            size="sm"
                                                            src={user.avatar}
                                                            placeholder={
                                                                user.name
                                                            }
                                                        />
                                                        {user.name}
                                                    </Group>
                                                </Button>
                                            }
                                        >
                                            <Link to="/editor">
                                                <Menu.Item icon={<News />}>
                                                    Start Writing
                                                </Menu.Item>
                                            </Link>
                                            <Link to={`/${user.username}`}>
                                                <Menu.Item
                                                    icon={<UserCircle />}
                                                >
                                                    Profile
                                                </Menu.Item>
                                            </Link>
                                            <Menu.Item
                                                onClick={() => {
                                                    localStorage.removeItem(
                                                        "user"
                                                    );
                                                    navigate(-1);
                                                    window.location.reload();
                                                }}
                                                icon={<Logout />}
                                                color="red"
                                            >
                                                Logout
                                            </Menu.Item>
                                        </Menu>
                                    </>
                                ) : !signin ? (
                                    <>
                                        <Link to="/login">
                                            <Button
                                                sx={() => ({
                                                    backgroundColor:
                                                        theme.colorScheme ===
                                                        "dark"
                                                            ? theme.colors
                                                                  .blue[8]
                                                            : theme.colors
                                                                  .dark[9],
                                                    transition:
                                                        "background-color 0.3s",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            theme.colorScheme ===
                                                            "dark"
                                                                ? theme.colors
                                                                      .blue[4]
                                                                : theme.colors
                                                                      .dark[5],
                                                    },
                                                })}
                                                radius={30}
                                            >
                                                Login
                                            </Button>
                                        </Link>
                                        <Link to="/register">
                                            <Button
                                                sx={() => ({
                                                    backgroundColor:
                                                        theme.colorScheme ===
                                                        "dark"
                                                            ? theme.colors
                                                                  .blue[8]
                                                            : theme.colors
                                                                  .dark[9],
                                                    transition:
                                                        "background-color 0.3s",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            theme.colorScheme ===
                                                            "dark"
                                                                ? theme.colors
                                                                      .blue[4]
                                                                : theme.colors
                                                                      .dark[5],
                                                    },
                                                })}
                                                radius={30}
                                            >
                                                Register
                                            </Button>
                                        </Link>
                                    </>
                                ) : null}
                                <MediaQuery
                                    largerThan="sm"
                                    styles={{ display: "none" }}
                                >
                                    <Button
                                        variant="subtle"
                                        onClick={() => navigate("/search?q=")}
                                    >
                                        <Search />
                                    </Button>
                                </MediaQuery>
                                <ActionIcon
                                    variant="outline"
                                    color={dark ? "dark" : "gray"}
                                    onClick={() => toggleColorScheme()}
                                    title="Toggle color scheme"
                                >
                                    {dark ? (
                                        <Sun
                                            size={18}
                                            color={dark ? "white" : "black"}
                                        />
                                    ) : (
                                        <MoonStars size={18} />
                                    )}
                                </ActionIcon>
                            </Group>
                        </Box>
                    </Grid.Col>
                </MediaQuery>
            </Grid>
        </Header>
    );
}
