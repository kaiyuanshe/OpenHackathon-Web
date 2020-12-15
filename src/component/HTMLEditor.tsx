import { WebCellProps, component, mixin, watch, createCell } from 'web-cell';
import { importCSS } from 'web-utility/source/DOM';
import Quill, { QuillOptionsStatic } from 'quill';

export interface HTMLEditorProps extends WebCellProps {
    options?: QuillOptionsStatic;
    value?: string;
}

@component({
    tagName: 'html-editor',
    renderTarget: 'children'
})
export class HTMLEditor extends mixin<HTMLEditorProps>() {
    @watch
    options?: QuillOptionsStatic;

    protected box?: Quill;

    set value(value: string) {
        const { box } = this;

        if (box) box.root.innerHTML = value;
    }

    get value() {
        return this.box?.root.innerHTML;
    }

    async connectedCallback() {
        await importCSS(
            'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css'
        );
        super.connectedCallback();
    }

    /**
     * @see https://quilljs.com/docs/modules/toolbar/#container
     */
    protected boot = (node: HTMLElement) =>
        (this.box = new Quill(node, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ header: 1 }, { header: 2 }], // custom button values
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [{ direction: 'rtl' }], // text direction

                    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    [{ font: [] }],
                    [{ align: [] }],

                    ['clean'] // remove formatting button
                ]
            },
            ...this.options
        }));

    render({ defaultSlot }: HTMLEditorProps) {
        return <div ref={this.boot}>{defaultSlot}</div>;
    }
}
