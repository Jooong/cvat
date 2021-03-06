// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd/lib/grid';
import Pagination from 'antd/lib/pagination';

import { getProjectsAsync } from 'actions/projects-actions';
import { CombinedState, Project } from 'reducers/interfaces';
import ProjectItem from './project-item';

export default function ProjectListComponent(): JSX.Element {
    const dispatch = useDispatch();
    const projectsCount = useSelector((state: CombinedState) => state.projects.count);
    const { page } = useSelector((state: CombinedState) => state.projects.gettingQuery);
    const projectInstances = useSelector((state: CombinedState) => state.projects.current);
    const gettingQuery = useSelector((state: CombinedState) => state.projects.gettingQuery);

    function changePage(p: number): void {
        dispatch(
            getProjectsAsync({
                ...gettingQuery,
                page: p,
            }),
        );
    }

    const projects = projectInstances.reduce<Project[][]>((rows, key, index) => {
        if (index % 4 === 0) {
            rows.push([key]);
        } else {
            rows[rows.length - 1].push(key);
        }
        return rows;
    }, []);

    return (
        <>
            <Row justify='center' align='middle' className='cvat-project-list-content'>
                <Col className='cvat-projects-list' md={22} lg={18} xl={16} xxl={14}>
                    {projects.map(
                        (row: Project[]): JSX.Element => (
                            <Row key={row[0].instance.id} gutter={[8, 8]}>
                                {row.map((project: Project) => (
                                    <Col span={6} key={project.instance.id}>
                                        <ProjectItem projectInstance={project} />
                                    </Col>
                                ))}
                            </Row>
                        ),
                    )}
                </Col>
            </Row>
            <Row justify='center' align='middle'>
                <Col md={22} lg={18} xl={16} xxl={14}>
                    <Pagination
                        className='cvat-projects-pagination'
                        onChange={changePage}
                        showSizeChanger={false}
                        total={projectsCount}
                        pageSize={12}
                        current={page}
                        showQuickJumper
                    />
                </Col>
            </Row>
        </>
    );
}
