import {
    Avatar,
    Container,
    Grid,
    Group,
    Space,
    Text,
    Title,
    useMantineTheme,
    ScrollArea,
    Anchor,
    Center,
} from "@mantine/core";
import React from "react";
import SmallArticleCard from "./smallArticleCard";
import { Post } from "../../user/article";
import { Link } from "react-router-dom";
import { MoodSad } from "tabler-icons-react";
import FollowBtns from "../profile/followBtns";

type Props = {
    author: Post["author"];
    otherArticles: {
        _id: string;
        title: string;
        tag: string;
        slug: string;
        lastUpdated: string;
    }[];
    own: boolean;
};
export default function ArticleSideBar({ author, otherArticles, own }: Props) {
    const theme = useMantineTheme();
    const [followed, setFollowed] = React.useState<boolean>(author.followed);

    React.useEffect(() => {
        setFollowed(author.followed);
    }, [author.followed]);

    return (
        <Grid>
            <Grid.Col>
                <Group direction="row">
                    <Avatar
                        radius={50}
                        size="xl"
                        src={`data:image/jpeg;base64,${author.avatar}`}
                        component={Link}
                        to={
                            !own
                                ? `/profile/${author.username}`
                                : `/${author.username}`
                        }
                    />
                    <Group direction="column" spacing={5}>
                        <Group direction="column" spacing={1}>
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
                                <Title order={3}>
                                    {author.lastname + " " + author.firstname}
                                </Title>
                            </Anchor>
                            <Text
                                size="sm"
                                color="gray"
                                component={Link}
                                to={
                                    !own
                                        ? `/profile/${author.username}`
                                        : `/${author.username}`
                                }
                            >
                                {"@" + author.username}
                            </Text>
                        </Group>
                        {/* <Text
                            sx={() => ({
                                color:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.blue[8]
                                        : theme.colors.dark[2],
                            })}
                        >
                            1k followers
                        </Text> */}
                    </Group>
                </Group>
            </Grid.Col>
            <Grid.Col>
                <Text size="md">{author.description}</Text>
            </Grid.Col>
            <Grid.Col>
                {!own && (
                    <FollowBtns
                        followed={followed}
                        username={author.username}
                        setFollowed={setFollowed}
                    />
                )}
            </Grid.Col>
            <Space h="md" />
            <Grid.Col>
                <Title order={5}>
                    More of {author.lastname + " " + author.firstname}
                </Title>
            </Grid.Col>
            <Grid.Col>
                <ScrollArea style={{ height: "55vh" }}>
                    <Container>
                        <Grid>
                            {otherArticles.length > 0 ? (
                                otherArticles.map((article) => (
                                    <Grid.Col>
                                        <SmallArticleCard
                                            author={author}
                                            article={article}
                                            own={own}
                                        />
                                    </Grid.Col>
                                ))
                            ) : (
                                <Grid.Col>
                                    <Center>
                                        <MoodSad
                                            size={48}
                                            strokeWidth={2}
                                            color={
                                                theme.colorScheme === "dark"
                                                    ? "white"
                                                    : "black"
                                            }
                                        />
                                    </Center>
                                    <Title order={5} align="center">
                                        No more from{" "}
                                        {author.lastname +
                                            " " +
                                            author.firstname}{" "}
                                        for now
                                    </Title>
                                </Grid.Col>
                            )}
                        </Grid>
                    </Container>
                </ScrollArea>
            </Grid.Col>
        </Grid>
    );
}
