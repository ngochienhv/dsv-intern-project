import React, { Dispatch, SetStateAction } from "react";
import { Button, useMantineTheme } from "@mantine/core";
import { baseUrl } from "../others/fetchDataFunctions";
import Notifications from "../others/notification";
import axios from "axios";

export default function FollowBtns({
    followed,
    username,
    setFollowed,
}: {
    followed: boolean;
    username: string;
    setFollowed: Dispatch<SetStateAction<boolean>>;
}) {
    const theme = useMantineTheme();
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");
    const token = JSON.parse(localStorage.getItem("user") || "{}").token;
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

    const handleFollowUser = async () => {
        if (!token) {
            setNoti(true);
            setNotiMessage("Please login to follow this user!");
            setNotiStatus("fail");
        } else {
            await axios
                .post(
                    `${baseUrl}/profiles/${username}/follow`,
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
                        setFollowed(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleUnFollowUser = async () => {
        await axios
            .delete(`${baseUrl}/profiles/${username}/follow`, {
                headers: {
                    "x-access-token": token,
                },
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    setFollowed(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <>
            <Notifications
                noti={noti}
                setNoti={setNoti}
                notiStatus={notiStatus}
                notiMessage={notiMessage}
            />
            {followed ? (
                <Button sx={btnStyle} radius={30} onClick={handleUnFollowUser}>
                    Followed
                </Button>
            ) : (
                <Button sx={btnStyle} radius={30} onClick={handleFollowUser}>
                    Follow
                </Button>
            )}
        </>
    );
}
