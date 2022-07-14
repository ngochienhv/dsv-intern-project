import {
    Container,
    Grid,
    Group,
    Textarea,
    Button,
    Space,
    Title,
    useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import React from "react";
import Comment from "./comment";
import { Link, useParams } from "react-router-dom";
import Notifications from "../others/notification";
import { baseUrl } from "../others/fetchDataFunctions";

export type comment = {
    _id: string;
    content: string;
    user: {
        firstname: string;
        lastname: string;
        username: string;
        avatar: string;
    };
    time: string;
    own: boolean;
};

export default function CommentSection() {
    const { id } = useParams();
    const theme = useMantineTheme();
    const [comments, setComments] = React.useState<comment[]>([]);
    const [newCmt, setNewCmt] = React.useState<string>("");
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
    const cmtRef =
        React.useRef() as React.MutableRefObject<HTMLTextAreaElement>;

    const handleAddComment = () => {
        if (newCmt.length > 0) {
            axios
                .post(
                    `${baseUrl}/article/${id}/comment`,
                    { content: newCmt },
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                )
                .then((response) => {
                    console.log(response);
                    cmtRef.current.value = "";
                    let tempComments = [...comments];
                    tempComments.unshift(response.data);
                    setComments(tempComments);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setNoti(true);
            setNotiMessage("Please enter your comment!");
            setNotiStatus("fail");
        }
    };

    const getComments = async () => {
        const username = JSON.parse(
            localStorage.getItem("user") || "{}"
        ).username;
        axios
            .get(`${baseUrl}/article/${id}/${username}/comment`)
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    setComments(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const btnStyle = () => ({
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
    React.useEffect(() => {
        getComments();
    }, []);

    return (
        <Container size="lg">
            <Notifications
                noti={noti}
                setNoti={setNoti}
                notiStatus={notiStatus}
                notiMessage={notiMessage}
            />
            <Grid>
                <Grid.Col>
                    <Textarea
                        placeholder={
                            token ? "Your comment" : "Please login to comment!"
                        }
                        label="Leave a comment"
                        autosize
                        size="md"
                        onChange={(event) => setNewCmt(event.target.value)}
                        ref={cmtRef}
                    />
                    <Space h="md" />
                    <Group noWrap position="apart">
                        <Title order={3}>Discussion</Title>
                        <Group position="right">
                            {token ? (
                                <Button
                                    sx={btnStyle}
                                    radius={30}
                                    onClick={handleAddComment}
                                >
                                    Comment
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        sx={btnStyle}
                                        radius={30}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        sx={btnStyle}
                                        radius={30}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </Group>
                    </Group>
                </Grid.Col>

                {comments.length > 0 ? (
                    comments.map((comment) => {
                        return (
                            <Grid.Col key={comment._id}>
                                <Comment comment={comment} />
                            </Grid.Col>
                        );
                    })
                ) : (
                    <Grid.Col>
                        <Title order={4} align="center">
                            Be the first one comment on this post!
                        </Title>
                    </Grid.Col>
                )}
            </Grid>
        </Container>
    );
}
