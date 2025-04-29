// CKEditor1.jsx
import { useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import '@ant-design/v5-patch-for-react-19';
import {
  ClassicEditor,
  Autoformat,
  AutoImage,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  CloudServices,
  Code,
  Emoji,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Markdown,
  MediaEmbed,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  PlainTableOutput,
  RemoveFormat,
  ShowBlocks,
  SimpleUploadAdapter,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const LICENSE_KEY = 'GPL'; // Replace with your actual license key if needed

export default function CKEditor1({ data = "", onChange }) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null); // Lưu instance của editor
  const editorInstanceRef = useRef(null); // Thêm ref để lưu trữ instance của editor
  const editorWordCountRef = useRef(null);
  const editorMenuBarRef = useRef(null);
  
  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Đảm bảo hủy editor khi component unmount
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroy();
        } catch (error) {
          console.warn('Không thể hủy editor:', error);
        }
        editorInstanceRef.current = null;
      }
    };
  }, []);

  // Logic để đảm bảo các ref tồn tại trước khi sử dụng
  const safeAppendChild = (parent, child) => {
    if (parent && parent.appendChild && child) {
      try {
        parent.appendChild(child);
      } catch (error) {
        console.warn('Không thể append child:', error);
      }
    }
  };

  // Logic để đảm bảo an toàn khi cleanup DOM
  const safeRemoveChildren = (parent) => {
    if (parent) {
      try {
        Array.from(parent.children || []).forEach((child) => {
          try {
            child.remove();
          } catch (error) {
            console.warn('Không thể remove child:', error);
          }
        });
      } catch (error) {
        console.warn('Lỗi khi xóa children:', error);
      }
    }
  };

  const editorConfig = {
    toolbar: {
      items: [
        'sourceEditing',
        'showBlocks',
        'findAndReplace',
        'textPartLanguage',
        'fullscreen',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'code',
        'removeFormat',
        '|',
        'emoji',
        'specialCharacters',
        'pageBreak',
        'link',
        'insertImage',
        'insertImageViaUrl',
        'mediaEmbed',
        'insertTable',
        'highlight',
        'blockQuote',
        'htmlEmbed',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Autoformat,
      AutoImage,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      BlockToolbar,
      Bold,
      CloudServices,
      Code,
      Emoji,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Markdown,
      MediaEmbed,
      Mention,
      PageBreak,
      Paragraph,
      PasteFromMarkdownExperimental,
      PasteFromOffice,
      PlainTableOutput,
      RemoveFormat,
      ShowBlocks,
      SimpleUploadAdapter,
      SourceEditing,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      TextTransformation,
      TodoList,
      Underline,
      WordCount,
    ],
    balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
    blockToolbar: [
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      '|',
      'link',
      'insertImage',
      'insertTable',
      'insertTableLayout',
      '|',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
      ],
    },
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file',
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    mention: {
      feeds: [
        {
          marker: '@',
          feed: [],
        },
      ],
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
    },
  };

  return (
    <div className="main-container">
      <div
        className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-word-count"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef}>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfig}
              data={data}
              onChange={(event, editor) => {
                // Kiểm tra editor tồn tại trước khi gọi getData()
                if (editor) {
                  try {
                    const newData = editor.getData();
                    if (onChange) {
                      onChange(newData);
                    }
                  } catch (error) {
                    console.warn('Lỗi trong onChange handler:', error);
                  }
                }
              }}
              onReady={(editor) => {
                if (!editor) {
                  console.warn('Editor không được khởi tạo đúng trong onReady');
                  return;
                }
                
                // Lưu trữ editor instance để có thể dọn dẹp sau này
                editorInstanceRef.current = editor;
                
                try {
                  // Kiểm tra trước khi lấy plugin
                  const wordCount = editor.plugins && editor.plugins.get ? 
                    editor.plugins.get('WordCount') : null;
                  
                  if (wordCount && editorWordCountRef.current) {
                    safeAppendChild(editorWordCountRef.current, wordCount.wordCountContainer);
                  }
                  
                  // Kiểm tra trước khi truy cập menuBarView
                  if (editorMenuBarRef.current && 
                      editor.ui && 
                      editor.ui.view && 
                      editor.ui.view.menuBarView) {
                    safeAppendChild(editorMenuBarRef.current, editor.ui.view.menuBarView.element);
                  }
                } catch (error) {
                  console.warn('Lỗi trong onReady handler:', error);
                }
              }}
              onDestroy={(editor) => {
                // Đặt instance về null khi editor bị hủy
                if (editor === editorInstanceRef.current) {
                  editorInstanceRef.current = null;
                }
              }}
              onAfterDestroy={() => {
                // An toàn hơn khi xóa children
                try {
                  if (editorWordCountRef.current) {
                    safeRemoveChildren(editorWordCountRef.current);
                  }
                  
                  if (editorMenuBarRef.current) {
                    safeRemoveChildren(editorMenuBarRef.current);
                  }
                } catch (error) {
                  console.warn('Lỗi trong onAfterDestroy handler:', error);
                }
              }}
              onError={(error, { phase }) => {
                console.error(`CKEditor error during ${phase} phase:`, error);
              }}
            />
          </div>
        </div>
        <div className="editor_container__word-count" ref={editorWordCountRef}></div>
        <div className="editor_container__menu-bar" ref={editorMenuBarRef}></div>
      </div>
    </div>
  );
}