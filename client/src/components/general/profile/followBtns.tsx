import React, { Dispatch, SetStateAction } from "react";
import { Button, useMantineTheme } from "@mantine/core";
import {
    handleFollowUser,
    handleUnFollowUser,
} from "../others/fetchDataFunctions";

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

    return followed ? (
        <Button
            sx={btnStyle}
            radius={30}
            onClick={() =>
                handleUnFollowUser(username ? username : "", setFollowed)
            }
        >
            Followed
        </Button>
    ) : (
        <Button
            sx={btnStyle}
            radius={30}
            onClick={() =>
                handleFollowUser(username ? username : "", setFollowed)
            }
        >
            Follow
        </Button>
    );
}
