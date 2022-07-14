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
import { useModals } from "@mantine/modals";

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
    const modals = useModals();

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: (
                <Title order={3} style={{ color: "#f03e3e" }}>
                    Delete Article
                </Title>
            ),
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this article, this article
                    will be deleted permanently and can't be recovered!
                </Text>
            ),
            labels: { confirm: "Delete article", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () =>
                handleDeleteArticle(
                    id,
                    setNoti,
                    setNotiMessage,
                    setNotiStatus,
                    setUnpublishedArticles
                ),
        });

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
                                onClick={() => openDeleteModal()}
                            >
                                Delete
                            </Menu.Item>
                        </Menu>
                    </Group>
                    <Text lineClamp={1}>{content}</Text>
                    <Text size="sm">Last updated: {lastUpdated}</Text>
                </Group>
            </Container>
        </div>
    );
}
