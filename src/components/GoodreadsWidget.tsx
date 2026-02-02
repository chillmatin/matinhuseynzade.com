export default function GoodreadsWidget() {
  return (
    <div 
      dangerouslySetInnerHTML={{
        __html: `
          <style type="text/css" media="screen">
            .gr_custom_container_1770072713 {
              border: 1px solid gray;
              border-radius:10px;
              padding: 10px 5px 10px 5px;
              background-color: transparent;
              color: inherit;
              width: 100%;
              max-width: 600px;
            }
            .gr_custom_header_1770072713 {
              border-bottom: 1px solid gray;
              width: 100%;
              margin-bottom: 10px;
              padding-bottom: 5px;
              text-align: center;
              font-size: 1.1em;
            }
            .gr_custom_each_container_1770072713 {
              width: 100%;
              clear: both;
              margin-bottom: 15px;
              overflow: auto;
              padding-bottom: 10px;
              border-bottom: 1px solid #ddd;
            }
            .gr_custom_book_container_1770072713 {
              overflow: hidden;
              height: 80px;
              float: left;
              margin-right: 10px;
              width: 53px;
            }
            .gr_custom_author_1770072713 {
              font-size: 0.9em;
              color: #666;
            }
            .gr_custom_rating_1770072713 {
              float: right;
            }
          </style>
          <div id="gr_custom_widget_1770072713"></div>
          <script src="https://www.goodreads.com/review/custom_widget/190062890.Matin's%20bookshelf:%20currently-reading?cover_position=left&cover_size=small&num_books=5&order=a&shelf=currently-reading&show_author=1&show_cover=1&show_rating=0&show_review=0&show_tags=0&show_title=1&sort=date_added&widget_bg_color=FFFFFF&widget_bg_transparent=true&widget_border_width=1&widget_id=1770072713&widget_text_color=000000&widget_title_size=medium&widget_width=full" type="text/javascript" charset="utf-8"></script>
        `
      }}
    />
  );
}
