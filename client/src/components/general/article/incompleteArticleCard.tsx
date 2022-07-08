import {
    Container,
    Text,
    Title,
    useMantineTheme,
    Menu,
    Group,
} from "@mantine/core";
import React, { SetStateAction, Dispatch } from "react";
import { Edit, NewsOff } from "tabler-icons-react";
import Notifications from "../others/notification";
import { handleDeleteArticle } from "../others/fetchDataFunctions";
import { Article } from "../../user/editor";

type Props = {
    id: string;
    title: string | null;
    content: string;
    lastUpdated: string | null;
    setArticleId: Dispatch<SetStateAction<string>>;
    setUnpublishedArticles: Dispatch<SetStateAction<Article[]>>;
};

export default function IncompleteArticleCard({
    id,
    title,
    content,
    lastUpdated,
    setArticleId,
    setUnpublishedArticles,
}: Props) {
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");
    const theme = useMantineTheme();

    return (
        <div key={id}>
            <Notifications
                noti={noti}
                setNoti={setNoti}
                notiStatus={notiStatus}
                notiMessage={notiMessage}
            />
            <Container
                style={
                    theme.colorScheme === "dark"
                        ? { borderBottom: "2px solid #4d4f66" }
                        : { borderBottom: "2px solid #e9ecef" }
                }
                pb={10}
            >
                <Group direction="column" spacing={10}>
                    <Group>
                        <Group
                            onClick={() => setArticleId(id)}
                            style={{ cursor: "pointer" }}
                        >
                            <Title order={4}>
                                {title ? title : "No Title yet"}
                            </Title>
                        </Group>
                        <Text size="sm">Last updated: {lastUpdated}</Text>
                        <Menu size="sm" shadow="sm">
                            <Menu.Item
                                icon={<Edit size={20} strokeWidth={2} />}
                                onClick={() => setArticleId(id)}
                            >
                                Edit
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                icon={<NewsOff size={20} strokeWidth={2} />}
                                onClick={() =>
                                    handleDeleteArticle(
                                        id,
                                        setNoti,
                                        setNotiMessage,
                                        setNotiStatus,
                                        setUnpublishedArticles
                                    )
                                }
                            >
                                Delete
                            </Menu.Item>
                        </Menu>
                    </Group>
                    <Text lineClamp={1}>{content}</Text>
                </Group>
            </Container>
        </div>
    );
}
