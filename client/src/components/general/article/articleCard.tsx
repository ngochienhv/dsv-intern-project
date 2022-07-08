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

type Props = {
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
    setArticleId: Dispatch<SetStateAction<string>>;
    setArticles: Dispatch<SetStateAction<Article[]>>;
    editable: boolean;
};

export default function ArticleCard({
    _id,
    title,
    description,
    author,
    image,
    slug,
    tags,
    lastUpdated,
    favoritesCount,
    favorited,
    bookmarked,
    own,
    setArticleId,
    setArticles,
    editable,
}: Props) {
    const { width } = useViewportSize();
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");
    const theme = useMantineTheme();

    return (
        <div key={_id}>
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
                key={_id}
            >
                <Grid columns={22} key={_id}>
                    <Grid.Col key={0}>
                        {!own && (
                            <Group direction="row">
                                <Avatar
                                    radius="xl"
                                    src={`data:image/jpeg;base64,${author.avatar}`}
                                    component={Link}
                                    to={`/profile/${author.username}`}
                                />
                                <Group direction="column" spacing={3}>
                                    <Anchor
                                        component={Link}
                                        to={`/profile/${author.username}`}
                                        underline={false}
                                        variant="text"
                                    >
                                        <Title order={5}>
                                            {author.lastname +
                                                " " +
                                                author.firstname}
                                        </Title>
                                    </Anchor>
                                    <Text
                                        size="sm"
                                        color="gray"
                                        component={Link}
                                        to={`/profile/${author.username}`}
                                    >
                                        {"@" + author.username}
                                    </Text>
                                </Group>
                            </Group>
                        )}
                    </Grid.Col>
                    <Grid.Col xl={18} lg={18} md={18} sm={16} xs={13} key={1}>
                        <Group direction="column" spacing={5}>
                            <Anchor
                                component={Link}
                                to={`/article/${slug}/${_id}`}
                                underline={false}
                                variant="text"
                            >
                                <Title order={3}>{title}</Title>
                            </Anchor>
                            <Text
                                component={Link}
                                to={`/article/${slug}/${_id}`}
                                lineClamp={2}
                            >
                                {description}
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
                            to={`/article/${slug}/${_id}`}
                            underline={false}
                            variant="text"
                        >
                            <Image src={image} fit="cover" />
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
                                {lastUpdated}
                            </Text>
                            {tags
                                ?.slice(0, tags.length > 2 ? 2 : tags.length)
                                .map((tag) => (
                                    <Tag tag={tag} key={tag} />
                                ))}

                            {!own ? (
                                <LikeFollowControll
                                    id={_id}
                                    favorited={favorited}
                                    favoritesCount={favoritesCount}
                                    bookmarked={bookmarked}
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
                                                color="blue"
                                                variant="transparent"
                                            >
                                                <Heart
                                                    size={28}
                                                    strokeWidth={2}
                                                    fill="#2181d7"
                                                />
                                            </ActionIcon>
                                            <Title order={5}>
                                                {favoritesCount}
                                            </Title>
                                        </Group>
                                    </Card>
                                    {editable && (
                                        <Menu size="sm" shadow="sm">
                                            <Menu.Item
                                                icon={
                                                    <Edit
                                                        size={20}
                                                        strokeWidth={2}
                                                    />
                                                }
                                                onClick={() =>
                                                    setArticleId(_id)
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
                                                    handleDeleteArticle(
                                                        _id,
                                                        setNoti,
                                                        setNotiMessage,
                                                        setNotiStatus,
                                                        setArticles
                                                    )
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
