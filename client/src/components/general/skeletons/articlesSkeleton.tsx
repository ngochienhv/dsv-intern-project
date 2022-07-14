import React from "react";
import {
    Avatar,
    Badge,
    Container,
    Skeleton,
    Grid,
    Group,
    Text,
    Title,
    Image,
    useMantineTheme,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
export default function ArticleSkeleton() {
    const theme = useMantineTheme();
    const { width } = useViewportSize();
    return (
        <Container
            p={width < 768 ? 0 : 5}
            style={
                theme.colorScheme === "dark"
                    ? { borderBottom: "2px solid #4d4f66" }
                    : { borderBottom: "2px solid #ced4da" }
            }
            pb={5}
        >
            <Grid columns={22}>
                <Grid.Col key={0}>
                    <Group direction="row">
                        <Skeleton circle height={50}>
                            <Avatar radius="xl" src={null} />
                        </Skeleton>
                        <Group direction="column" spacing={3}>
                            <Skeleton>
                                <Title order={5}>Lorem, ipsum dolor.</Title>
                            </Skeleton>
                            <Skeleton>
                                <Text size="sm" color="gray">
                                    Lorem, ipsum dolor.
                                </Text>
                            </Skeleton>
                        </Group>
                    </Group>
                </Grid.Col>
                <Grid.Col xl={18} lg={18} md={18} sm={16} xs={13} key={1}>
                    <Group direction="column" spacing={5}>
                        <Skeleton>
                            <Title order={3}>
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit. Voluptatum, ipsam.
                            </Title>
                        </Skeleton>
                        <Skeleton>
                            <Text lineClamp={2}>
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit. Accusantium inventore id quas
                                blanditiis rem modi suscipit quis porro natus
                                fugit aspernatur laudantium quaerat alias,
                                obcaecati, sapiente voluptatibus animi delectus
                                labore.
                            </Text>
                        </Skeleton>
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
                    <Skeleton height="auto">
                        <Image src={""} fit="cover" withPlaceholder />
                    </Skeleton>
                </Grid.Col>
                <Grid.Col>
                    <Group spacing={width < 768 ? 8 : null!}>
                        <Skeleton width="auto">
                            <Text size="sm" color="gray">
                                Lorem, ipsum dolor.
                            </Text>
                        </Skeleton>
                        {[1, 2].map((x) => (
                            <Skeleton key={x} width="auto">
                                <Badge>Lorem, ipsum.</Badge>
                            </Skeleton>
                        ))}
                    </Group>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
