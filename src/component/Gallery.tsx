import { component, watch, createCell, Fragment } from 'web-cell';
import {
    CarouselItemProps,
    CarouselProps,
    CarouselCaption,
    CarouselItem,
    CarouselView
} from 'boot-cell/source/Media/Carousel';
import { Image } from 'boot-cell/source/Media/Image';
import classNames from 'classnames';

import style from './Gallery.module.less';

export type GalleryItem = Pick<CarouselItemProps, 'image' | 'title' | 'detail'>;

export interface GalleryProps extends CarouselProps {
    list: GalleryItem[];
    activeIndex?: number;
}

@component({
    tagName: 'gallery-view',
    renderTarget: 'children'
})
export class GalleryView extends CarouselView {
    @watch
    set list(list: GalleryItem[]) {
        this.setProps({ list }).then(
            () =>
                (this.defaultSlot = list.map(({ image, title, detail }) => (
                    <CarouselItem>
                        <Image background src={image} />
                        <CarouselCaption title={title} detail={detail} />
                    </CarouselItem>
                )))
        );
    }

    connectedCallback() {
        this.classList.add(style.box);

        super.connectedCallback();
    }

    render({ list, activeIndex }: GalleryProps) {
        return (
            <>
                <div className="flex-fill">{super.render(this.props)}</div>

                <div className="d-flex flex-column justify-content-between">
                    {list.map(({ image }, index) => (
                        <Image
                            background
                            className={classNames(
                                'flex-fill',
                                activeIndex === index && 'active'
                            )}
                            src={image}
                            onClick={() => this.turnTo(index)}
                        />
                    ))}
                </div>
            </>
        );
    }
}
