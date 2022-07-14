import {
    Grid,
    Group,
    Avatar,
    Text,
    Button,
    Paper,
    Title,
    MediaQuery,
    Space,
    Anchor,
    Popover,
} from "@mantine/core";
import axios from "axios";
import React from "react";
import { comment } from "./commentSection";
import { Link } from "react-router-dom";
import { useModals } from "@mantine/modals";
import { baseUrl } from "../others/fetchDataFunctions";

export default function Comment({ comment }: { comment: comment }) {
    const [exist, setExists] = React.useState<boolean>(true);
    const [opened1, setOpened1] = React.useState<boolean>(false);
    const [opened2, setOpened2] = React.useState<boolean>(false);

    const handleDeleteComment = async () => {
        await axios
            .delete(`${baseUrl}/article/comment?commentId=${comment._id}`, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((response) => {
                console.log(response);
                setExists(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const modals = useModals();

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: (
                <Title order={3} style={{ color: "#f03e3e" }}>
                    Delete Comment
                </Title>
            ),
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this comment ?
                </Text>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => handleDeleteComment(),
        });

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
                            src={comment.user.avatar}
                            alt="avatar"
                            size={35}
                        />
                    </Anchor>
                    {/* <Divider
                        orientation="vertical"
                        style={{ marginLeft: 17, height: "65%" }}
                    /> */}
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
                            <Popover
                                opened={opened1}
                                onClose={() => setOpened1(false)}
                                target={
                                    <Button
                                        variant="subtle"
                                        size="xs"
                                        onClick={() => setOpened1((o) => !o)}
                                    >
                                        Like
                                    </Button>
                                }
                                width={260}
                                position="bottom"
                                withArrow
                            >
                                <div style={{ display: "flex" }}>
                                    <Text size="sm">
                                        Feature in development and will be
                                        updated soon
                                    </Text>
                                </div>
                            </Popover>
                            <Popover
                                opened={opened2}
                                onClose={() => setOpened2(false)}
                                target={
                                    <Button
                                        variant="subtle"
                                        size="xs"
                                        onClick={() => setOpened2((o) => !o)}
                                    >
                                        Reply
                                    </Button>
                                }
                                width={260}
                                position="bottom"
                                withArrow
                            >
                                <div style={{ display: "flex" }}>
                                    <Text size="sm">
                                        Feature in development and will be
                                        updated soon
                                    </Text>
                                </div>
                            </Popover>
                            {comment.own && (
                                <Button
                                    variant="subtle"
                                    color="red"
                                    onClick={openDeleteModal}
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
