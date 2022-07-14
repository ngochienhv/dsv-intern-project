import {
    Avatar,
    Container,
    Group,
    Title,
    Card,
    Text,
    Anchor,
    Space,
} from "@mantine/core";
import { CalendarTime } from "tabler-icons-react";
import { Link } from "react-router-dom";
import React from "react";
import { Post } from "../../user/article";

export type smallArticle = {
    author: Post["author"];
    _id: string;
    title: string;
    slug: string;
    lastUpdated: string;
};
export default function SmallArticleCard({
    author,
    _id,
    title,
    slug,
    lastUpdated,
}: smallArticle) {
    return (
        <Card shadow="xs">
            <Container>
                <Group direction="row">
                    <Avatar
                        radius="xl"
                        src={author.avatar}
                        component={Link}
                        to={`/profile/${author.username}`}
                        size="sm"
                    />
                    <Anchor
                        component={Link}
                        to={`/profile/${author.username}`}
                        underline={false}
                        variant="text"
                    >
                        <Title order={5}>
                            {author.lastname + " " + author.firstname}
                        </Title>
                    </Anchor>
                </Group>
                <Space h="xs" />
                <Anchor
                    component={Link}
                    to={`/article/${slug}/${_id}`}
                    underline={false}
                    variant="text"
                >
                    <Text component={Title} order={6} lineClamp={1}>
                        {title}
                    </Text>
                </Anchor>
                <Space h="xs" />
                <Group>
                    <CalendarTime
                        size={18}
                        strokeWidth={2}
                        style={{ marginRight: -8 }}
                    />
                    <Text>{new Date(lastUpdated).toDateString()}</Text>
                </Group>
            </Container>
        </Card>
    );
}
