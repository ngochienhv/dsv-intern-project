import React from "react";
import {
    Avatar,
    Container,
    Grid,
    Group,
    Text,
    Title,
    Paper,
    Anchor,
    TypographyStylesProvider,
    Divider,
    Space,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { Link } from "react-router-dom";
import "../../../css/article.css";
import Tag from "../others/tag";
import LikeFollowControll from "./likeFollow";

export default function ContentSection({
    article,
}: {
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
        lastUpdated: string;
        slug: string;
        tags: string[] | null;
        title: string;
        content: string;
        own: boolean;
    };
}) {
    const { width } = useViewportSize();

    return (
        <Paper>
            <Container p={width < 768 ? 10 : null!} size={900}>
                <Grid>
                    <Grid.Col key={article._id}>
                        <Space h="sm" />
                        <Group>
                            <Avatar
                                radius="xl"
                                src={`data:image/jpeg;base64,${article.author.avatar}`}
                                component={Link}
                                to={
                                    !article.own
                                        ? `/profile/${article.author.username}`
                                        : `/${article.author.username}`
                                }
                            />
                            <Group direction="column" spacing={1}>
                                <Anchor
                                    component={Link}
                                    to={
                                        !article.own
                                            ? `/profile/${article.author.username}`
                                            : `/${article.author.username}`
                                    }
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
                                    to={
                                        !article.own
                                            ? `/profile/${article.author.username}`
                                            : `/${article.author.username}`
                                    }
                                >
                                    {"@" + article.author.username}
                                </Text>
                            </Group>
                            <Text size="sm" color="gray">
                                Last updated: {article.lastUpdated}
                            </Text>

                            {!article.own && (
                                <Group position="right">
                                    <LikeFollowControll
                                        id={article._id}
                                        favorited={article.favorited}
                                        favoritesCount={article.favoritesCount}
                                        bookmarked={article.bookmarked}
                                    />
                                </Group>
                            )}
                            {article.tags?.map((tag) => (
                                <Tag tag={tag} key={tag} />
                            ))}
                        </Group>
                    </Grid.Col>
                    <Grid.Col>
                        <Divider my="sm" size="md" />
                    </Grid.Col>
                    <Grid.Col key={article._id + "1"}>
                        <Group direction="column">
                            <Title order={1}>{article.title}</Title>
                            <Title order={4}>{article.description}</Title>
                        </Group>
                        <TypographyStylesProvider className="article-content">
                            {
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: article.content,
                                    }}
                                />
                            }
                        </TypographyStylesProvider>
                    </Grid.Col>
                </Grid>
            </Container>
        </Paper>
    );
}
