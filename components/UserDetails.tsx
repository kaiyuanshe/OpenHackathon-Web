import { Container, Row, Col, Tabs, Tab, Card, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faQq, faWeixin, faWeibo } from "@fortawesome/free-brands-svg-icons"

import Link from 'next/link';
import { Session } from '../pages/api/user/session';


export interface AuthingSessionProps extends Session {
    className: string;
}

export const UserDetail: React.FC<{ userInfo: AuthingSessionProps }> = ({ userInfo: {
    nickname, photo, registerSource
} }) => {
    const href = 'https://ophapiv2-demo.authing.cn/u';

    return (
        <>
            <Container style={{ minWidth: '520px' }}>
                <Row  >
                    <Col lg='auto'>
                        <Container className="mb-4">
                            <Card
                                border='secondery'
                                className="border"

                            >
                                <Card.Title as='h2' className='m-3'>
                                    {nickname}
                                </Card.Title>
                                <Card.Img src={photo} style={{ width: '6.5rem' }} className='mx-3 mb-3' alt='' />

                                <Card.Body className='text-start border-top p-3'>
                                    <Link
                                        href={`https://github.com/${nickname}`}
                                        passHref>
                                        <FontAwesomeIcon
                                            className={registerSource.includes(`social:github`) ? 'text-success fa-stack' : 'text-secondary fa-stack'}
                                            icon={faGithub}
                                        />
                                    </Link>

                                    <FontAwesomeIcon
                                        className='text-secondary fa-stack'
                                        icon={faQq}

                                    />


                                    <FontAwesomeIcon
                                        className='text-secondary fa-stack'
                                        icon={faWeixin}

                                    />

                                    <FontAwesomeIcon
                                        className='text-secondary fa-stack'
                                        icon={faWeibo}

                                    />

                                </Card.Body>
                                <Card.Body
                                    className='text-center border-top p-3'
                                >
                                    <Link
                                        href={href}
                                        passHref
                                    >
                                        <Button variant="warning" >
                                            编辑用户资料
                                        </Button>
                                    </Link>
                                </Card.Body>

                            </Card>

                        </Container>
                    </Col>
                    <Col>
                        <Container className='mb-4' fluid='lg'>
                            <Tabs defaultActiveKey="enroll" className="w-100 mb-3 justify-content-center">
                                <Tab eventKey="enroll" title="参与的活动">

                                </Tab>
                                <Tab eventKey="admin" title="创建的活动">

                                </Tab>
                                <Tab eventKey="contact" title="关注的活动">

                                </Tab>
                            </Tabs>
                        </Container>
                    </Col>
                </Row>
            </Container>



        </>
    )
}