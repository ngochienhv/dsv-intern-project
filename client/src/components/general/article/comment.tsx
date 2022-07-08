import {
    Grid,
    Group,
    Avatar,
    Text,
    Divider,
    Button,
    Paper,
    Title,
    MediaQuery,
    Space,
    Anchor,
} from "@mantine/core";
import axios from "axios";
import React from "react";
import { comment } from "./commentSection";
import { Link } from "react-router-dom";

export default function Comment({ comment }: { comment: comment }) {
    const [exist, setExists] = React.useState<boolean>(true);
    const handleDeleteComment = async () => {
        await axios
            .delete(
                `http://localhost:5000/api/article/comment?commentId=${comment._id}`,
                {
                    headers: {
                        "x-access-token": JSON.parse(
                            localStorage.getItem("user") || "{}"
                        ).token,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setExists(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return exist ? (
        <Grid columns={22} key={comment._id}>
            <MediaQuery smallerThan="xs" styles={{ maxWidth: "10%" }}>
                <Grid.Col
                    xl={1}
                    lg={1}
                    md={1}
                    sm={1}
                    xs={2}
                    style={{ marginTop: 12 }}
                >
                    <Anchor
                        component={Link}
                        to={
                            !comment.own
                                ? `/profile/${comment.user.username}`
                                : `/${comment.user.username}`
                        }
                        underline={false}
                        variant="text"
                    >
                        <Avatar
                            radius="xl"
                            src={`data:image/jpeg;base64,${comment.user.avatar}`}
                            alt="avatar"
                            size={35}
                        />
                    </Anchor>
                    <Divider
                        orientation="vertical"
                        style={{ marginLeft: 17, height: "65%" }}
                    />
                </Grid.Col>
            </MediaQuery>
            <MediaQuery smallerThan="xs" styles={{ maxWidth: "90%" }}>
                <Grid.Col xl={21} lg={21} md={21} sm={21} xs={20}>
                    <Paper p="md">
                        <Group direction="row" spacing={10}>
                            <Anchor
                                component={Link}
                                to={
                                    !comment.own
                                        ? `/profile/${comment.user.username}`
                                        : `/${comment.user.username}`
                                }
                                underline={false}
                                variant="text"
                            >
                                <Title order={5}>
                                    {comment.user.lastname +
                                        " " +
                                        comment.user.firstname}
                                </Title>
                            </Anchor>
                            <Text
                                size="sm"
                                color="gray"
                                component={Link}
                                to={
                                    !comment.own
                                        ? `/profile/${comment.user.username}`
                                        : `/${comment.user.username}`
                                }
                            >
                                . {"@" + comment.user.username}
                            </Text>
                            <Text size="sm" color="gray">
                                . {comment.time}
                            </Text>
                        </Group>
                        <Space h="sm" />
                        <Text>{comment.content}</Text>
                        <Space h="sm" />
                        <Group spacing={2}>
                            <Button variant="subtle" size="xs">
                                Like
                            </Button>
                            <Button variant="subtle" size="xs">
                                Reply
                            </Button>
                            {comment.own && (
                                <Button
                                    variant="subtle"
                                    color="red"
                                    onClick={handleDeleteComment}
                                    size="xs"
                                >
                                    Delete
                                </Button>
                            )}
                        </Group>
                    </Paper>
                </Grid.Col>
            </MediaQuery>
        </Grid>
    ) : null;
}
