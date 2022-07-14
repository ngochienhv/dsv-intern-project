import React from "react";
import { ActionIcon, Card, Group, Title, Tooltip } from "@mantine/core";
import { Bookmark, Heart } from "tabler-icons-react";
import Notifications from "../others/notification";
import { baseUrl } from "../others/fetchDataFunctions";
import axios from "axios";

export default function LikeFollowControll({
    id,
    favorited,
    favoritesCount,
    bookmarked,
}: {
    id: string;
    favorited: boolean;
    favoritesCount: number;
    bookmarked: boolean;
}) {
    const [favorite, setFavorite] = React.useState<boolean>(favorited);
    const [bookmark, setBookmark] = React.useState<boolean>(bookmarked);
    const [count, setCount] = React.useState<number>(favoritesCount);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");

    const handleLikeArticle = async () => {
        setLoading(true);
        let token = JSON.parse(localStorage.getItem("user") || "{}").token;
        let url = favorite
            ? `${baseUrl}/article/unlike?articleId=${id}`
            : `${baseUrl}/article/like?articleId=${id}`;
        if (token) {
            await axios
                .post(
                    url,
                    {},
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response);
                        setFavorite((c) => !c);
                        setCount((c) => (favorite ? c - 1 : c + 1));
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            setNoti(true);
            setNotiMessage("Please login to like this post!");
            setNotiStatus("fail");
            setLoading(false);
        }
    };

    const handleBookmarkArticle = async () => {
        setLoading(true);
        let token = JSON.parse(localStorage.getItem("user") || "{}").token;
        let url = bookmark
            ? `${baseUrl}/article/bm/unbookmark?articleId=${id}`
            : `${baseUrl}/article/bm/bookmark?articleId=${id}`;
        if (token) {
            await axios
                .post(
                    url,
                    {},
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                )
                .then((response) => {
                    console.log(response);

                    if (response.status === 200) {
                        console.log(response);
                        setBookmark((c) => !c);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            setNoti(true);
            setNotiMessage("Please login to bookmark this post!");
            setNotiStatus("fail");
            setLoading(false);
        }
    };

    React.useEffect(() => {
        setFavorite(favorited);
        setCount(favoritesCount);
        setBookmark(bookmarked);
    }, [favorited, favoritesCount, bookmarked]);

    return (
        <>
            <Notifications
                noti={noti}
                setNoti={setNoti}
                notiStatus={notiStatus}
                notiMessage={notiMessage}
            />
            <Tooltip
                label={bookmark ? "Remove bookmark" : "Bookmark this post"}
                transition="fade"
                transitionDuration={300}
            >
                <ActionIcon
                    color="blue"
                    variant="transparent"
                    onClick={() => handleBookmarkArticle()}
                    loading={loading}
                >
                    <Bookmark
                        size={28}
                        strokeWidth={2}
                        fill={bookmark ? "#2181d7" : "none"}
                    />
                </ActionIcon>
            </Tooltip>

            <Card shadow="xs" p={3} pl={8} pr={8} radius="md">
                <Group spacing={8}>
                    <Tooltip
                        label={favorite ? "Unlike this post" : "Like this post"}
                        transition="fade"
                        transitionDuration={300}
                    >
                        <ActionIcon
                            color="red"
                            variant="transparent"
                            onClick={() => handleLikeArticle()}
                            loading={loading}
                        >
                            <Heart
                                size={28}
                                strokeWidth={2}
                                fill={favorite ? "red" : "none"}
                            />
                        </ActionIcon>
                    </Tooltip>
                    <Title order={5}>{count}</Title>
                </Group>
            </Card>
        </>
    );
}
