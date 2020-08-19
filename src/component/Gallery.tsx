import { component, watch, createCell, Fragment } from 'web-cell';
import {
    CarouselProps,
    CarouselView,
    CarouselItem
} from 'boot-cell/source/Media/Carousel';
import { Image } from 'boot-cell/source/Media/Image';

import style from './Gallery.module.less';

export interface GalleryProps extends CarouselProps {
    list: { image: string; title: string; detail: string }[];
    activeIndex?: number;
}

@component({
    tagName: 'gallery-view',
    renderTarget: 'children'
})
export class GalleryView extends CarouselView {
    @watch
    list: string[] = [];

    connectedCallback() {
        this.classList.add(style.box);

        super.connectedCallback();
    }

    render({ list, activeIndex }: GalleryProps) {
        return (
            <Fragment>
                <div className="flex-fill">
                    {super.render({
                        ...this.props,
                        defaultSlot: list.map(item => (
                            <CarouselItem {...item} />
                        ))
                    })}
                </div>
                <div className="d-flex flex-column justify-content-between">
                    {list.map(({ image }, index) => (
                        <Image
                            background
                            className={
                                activeIndex === index ? style.active : null
                            }
                            src={image}
                            onClick={() => this.turnTo(index)}
                        />
                    ))}
                </div>
            </Fragment>
        );
    }
}
