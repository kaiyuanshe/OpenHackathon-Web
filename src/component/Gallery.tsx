import { component, createCell, Fragment } from 'web-cell';
import { CarouselProps, CarouselView } from 'boot-cell/source/Content/Carousel';

import style from './Gallery.module.less';

@component({
    tagName: 'gallery-view',
    renderTarget: 'children'
})
export class GalleryView extends CarouselView {
    connectedCallback() {
        this.classList.add(style.box);

        super.connectedCallback();
    }

    render({ list, activeIndex }: CarouselProps) {
        return (
            <Fragment>
                <div className="flex-fill">{super.render(this.props)}</div>

                <div className="d-flex flex-column justify-content-between">
                    {list.map(({ image }, index) => (
                        <div
                            className={
                                activeIndex === index ? style.active : null
                            }
                            style={{ backgroundImage: `url(${image})` }}
                            onClick={() => this.turnTo(index)}
                        />
                    ))}
                </div>
            </Fragment>
        );
    }
}
