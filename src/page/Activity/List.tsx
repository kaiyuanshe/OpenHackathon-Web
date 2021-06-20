import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';
import 'boot-cell/source/Content/EdgeDetector';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';

import { activity } from '../../model';
import { ActivityGallery } from '../../component';

@observer
@component({
    tagName: 'activity-list',
    renderTarget: 'children'
})
export class ActivityList extends mixin() {
    connectedCallback() {
        this.classList.add('d-block', 'container', 'py-3');

        activity.getNextPage({}, true);

        super.connectedCallback();
    }

    loadMore = ({ detail }: EdgeEvent) => {
        if (detail === 'bottom') activity.getNextPage({});
    };

    render() {
        const { loading, list, nextPage } = activity;

        return (
            <>
                <h2 className="text-center mb-3">热门活动</h2>

                <edge-detector onTouchEdge={this.loadMore}>
                    <SpinnerBox cover={loading}>
                        <ActivityGallery list={list} />
                    </SpinnerBox>
                    <p slot="bottom" className="text-center">
                        {!nextPage ? '没有更多了' : '加载中……'}
                    </p>
                </edge-detector>
            </>
        );
    }
}
