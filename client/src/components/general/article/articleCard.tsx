import {
    Grid,
    Image,
    Text,
    Group,
    Container,
    Title,
    ActionIcon,
    Avatar,
    useMantineTheme,
    Menu,
    Anchor,
    Card,
} from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Heart, CalendarTime } from "tabler-icons-react";
import { useViewportSize } from "@mantine/hooks";
import { Edit, NewsOff } from "tabler-icons-react";
import { handleDeleteArticle } from "../others/fetchDataFunctions";
import Tag from "../others/tag";
import Notifications from "../others/notification";
import { Article } from "../../user/editor";
import LikeFollowControll from "./likeFollow";
import { useModals } from "@mantine/modals";

type Props = {
    article: {
        _id: string;
        author: {
            _id: string;
            username: string;
            firstname: string;
            lastname: string;
            avatar: string;
        };
        description: string;
        favoritesCount: number;
        favorited: boolean;
        bookmarked: boolean;
        image: string;
        lastUpdated: string;
        slug: string;
        tags: string[] | null;
        title: string;
        own: boolean;
        editable: boolean;
    };
    setArticleId: Dispatch<SetStateAction<string>>;
    setArticles: Dispatch<SetStateAction<Article[]>>;
};

export default function ArticleCard({
    article,
    setArticleId,
    setArticles,
}: Props) {
    const { width } = useViewportSize();
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
                    article._id,
                    setNoti,
                    setNotiMessage,
                    setNotiStatus,
                    setArticles
                ),
        });

    return (
        <div key={article._id}>
            <Notifications
                noti={noti}
                setNoti={setNoti}
                notiStatus={notiStatus}
                notiMessage={notiMessage}
            />
            <Container
                p={width < 768 ? 0 : 5}
                style={
                    theme.colorScheme === "dark"
                        ? { borderBottom: "2px solid #4d4f66" }
                        : { borderBottom: "2px solid #ced4da" }
                }
                pb={5}
                key={article._id}
            >
                <Grid columns={22} key={article._id}>
                    <Grid.Col key={0}>
                        <Group direction="row">
                            <Avatar
                                radius="xl"
                                src={article.author.avatar}
                                component={Link}
                                to={`/profile/${article.author.username}`}
                            />
                            <Group direction="column" spacing={3}>
                                <Anchor
                                    component={Link}
                                    to={`/profile/${article.author.username}`}
                                    underline={false}
                                    variant="text"
                                >
                                    <Title order={5}>
                                        {article.author.lastname +
                                            " " +
                                            article.author.firstname}
                                    </Title>
                                </Anchor>
                                <Text
                                    size="sm"
                                    color="gray"
                                    component={Link}
                                    to={`/profile/${article.author.username}`}
                                >
                                    {"@" + article.author.username}
                                </Text>
                            </Group>
                        </Group>
                    </Grid.Col>
                    <Grid.Col xl={18} lg={18} md={18} sm={16} xs={13} key={1}>
                        <Group direction="column" spacing={5}>
                            <Anchor
                                component={Link}
                                to={`/article/${article.slug}/${article._id}`}
                                underline={false}
                                variant="text"
                            >
                                <Title order={3}>{article.title}</Title>
                            </Anchor>
                            <Text
                                component={Link}
                                to={`/article/${article.slug}/${article._id}`}
                                lineClamp={2}
                            >
                                {article.description}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col
                        className="article-card-img-container"
                        xl={4}
                        lg={4}
                        md={4}
                        sm={6}
                        xs={9}
                    >
                        <Anchor
                            component={Link}
                            to={`/article/${article.slug}/${article._id}`}
                            underline={false}
                            variant="text"
                        >
                            <Image src={article.image} fit="cover" />
                        </Anchor>
                    </Grid.Col>
                    <Grid.Col>
                        <Group spacing={width < 768 ? 8 : null!}>
                            <CalendarTime
                                size={18}
                                strokeWidth={2}
                                style={{ marginRight: -8 }}
                            />
                            <Text size="sm" color="gray">
                                {new Date(article.lastUpdated).toDateString()}
                            </Text>
                            {article.tags
                                ?.slice(
                                    0,
                                    article.tags.length > 2
                                        ? 2
                                        : article.tags.length
                                )
                                .map((tag) => (
                                    <Tag tag={tag} key={tag} />
                                ))}

                            {!article.own ? (
                                <LikeFollowControll
                                    id={article._id}
                                    favorited={article.favorited}
                                    favoritesCount={article.favoritesCount}
                                    bookmarked={article.bookmarked}
                                />
                            ) : (
                                <Group spacing={2}>
                                    <Card
                                        shadow="xs"
                                        p={3}
                                        pl={8}
                                        pr={8}
                                        radius="md"
                                    >
                                        <Group spacing={5}>
                                            <ActionIcon
                                                color="red"
                                                variant="transparent"
                                            >
                                                <Heart
                                                    size={28}
                                                    strokeWidth={2}
                                                    fill="red"
                                                />
                                            </ActionIcon>
                                            <Title order={5}>
                                                {article.favoritesCount}
                                            </Title>
                                        </Group>
                                    </Card>
                                    {article.editable && (
                                        <Menu size="sm" shadow="sm">
                                            <Menu.Item
                                                icon={
                                                    <Edit
                                                        size={20}
                                                        strokeWidth={2}
                                                    />
                                                }
                                                onClick={() =>
                                                    setArticleId(article._id)
                                                }
                                            >
                                                Edit
                                            </Menu.Item>
                                            <Menu.Item
                                                color="red"
                                                icon={
                                                    <NewsOff
                                                        size={20}
                                                        strokeWidth={2}
                                                    />
                                                }
                                                onClick={() =>
                                                    openDeleteModal()
                                                }
                                            >
                                                Delete
                                            </Menu.Item>
                                        </Menu>
                                    )}
                                </Group>
                            )}
                        </Group>
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    );
}
