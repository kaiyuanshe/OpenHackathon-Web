import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { NavLink } from 'boot-cell/source/Navigator/Nav';

@observer
@component({
    tagName: 'manager-overview',
    renderTarget: 'children'
})
export class ManagerOverview extends mixin() {
    render() {
        return (
            <div>
                <NavLink href="create">创建黑客松</NavLink>
            </div>
        );
    }
}
