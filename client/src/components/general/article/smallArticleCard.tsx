import {
    Avatar,
    Container,
    Grid,
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

type Props = {
    author: Post["author"];
    article: {
        _id: string;
        title: string;
        tag: string;
        slug: string;
        lastUpdated: string;
    };
    own: boolean;
};
export default function SmallArticleCard({ author, article, own }: Props) {
    return (
        <Card
            component={Link}
            to={`/article/${article.slug}/${article._id}`}
            shadow="xs"
        >
            <Container>
                <Group direction="row">
                    <Avatar
                        radius="xl"
                        src={`data:image/jpeg;base64,${author.avatar}`}
                        component={Link}
                        to={
                            !own
                                ? `/profile/${author.username}`
                                : `/${author.username}`
                        }
                        size="sm"
                    />
                    <Anchor
                        component={Link}
                        to={
                            !own
                                ? `/profile/${author.username}`
                                : `/${author.username}`
                        }
                        underline={false}
                        variant="text"
                    >
                        <Title order={5}>
                            {author.lastname + " " + author.firstname}
                        </Title>
                    </Anchor>
                </Group>
                <Space h="xs" />
                <Title order={6}>{article.title}</Title>
                <Space h="xs" />
                <Group>
                    <CalendarTime
                        size={18}
                        strokeWidth={2}
                        style={{ marginRight: -8 }}
                    />
                    <Text>{article.lastUpdated}</Text>
                </Group>
            </Container>
        </Card>
    );
}
