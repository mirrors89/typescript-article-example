import {expect} from "chai";
import {sequelize} from "../../../app/src/models/index";
import Category from "../../../app/src/models/domain/category";
import Article from "../../../app/src/models/domain/article";
import Comment from "../../../app/src/models/domain/comment";
import * as moment from "moment";

describe("[Integration] 댓글 모델을 테스트 한다.", () => {
  moment.locale("ko-KR");

  const cleanUp = (cb: Function) => Category.destroy({where: {}, truncate: true}).then(() => cb());

  const categorySave = (given: Object, cb: Function) => {
    const category = new Category(given);
    category.save()
      .then((saveCategory: Category) => {
        cb(saveCategory);
      });
  };

  const articleSave = (given: Object, category: Category, cb: Function) => {
    const article = new Article(given);
    article.save().then((saveArticle: Article) => {
      category.$add("article", saveArticle);
      cb(saveArticle);
    })
  };

  const commentSave = (given: Object, article: Article, cb: Function) => {
    const comment = new Comment(given);
    comment.save().then((saveComment: Comment) => {
      article.$add("comment", saveComment);
      cb(saveComment);
    })
  };


  before((done: Function) => {
    sequelize.sync().then(() => {
      done();
    }).catch((error: Error) => {
      done(error);
    });
  });

  beforeEach((done: Function) => {
    cleanUp(() => {
      const now = moment.utc().format();

      let givenCategory = {name: "자유게시판", description: "자유롭게 글을 작성하세요.", cdate: now, udate: now};
      let givenArticles = [{title: "아티클1", subject: "아티클 내용입니다.", author: "작성자2", cdate: now, udate: now},
        {title: "아티클2", description: "이것도 아티클 내용입니다.", author: "작성자1", cdate: now, udate: now}];

    let givenComments = [{text: "코맨트1", author: "코맨트 작성자2", cdate: now, udate: now},
        {text: "코맨트2",  author: "코맨트 작성자2", cdate: now, udate: now}];


      categorySave(givenCategory, (saveCategory: Category) => {
        Article.bulkCreate<Article>(givenArticles).then((articles: Article[]) => {
          saveCategory.$add("article", articles);

          // articles.forEach((article: Article) => {
            Comment.bulkCreate<Comment>(givenComments).then((comments: Comment[]) => {
                articles[0].$add("comment", comments);
                done();                                                      
            });
          // });
          
        });
      });
    });
  });

  it("코멘트를 등록할 때 등록한 값이 리턴된다.", (done: Function) => {
    //given
    const now = moment.utc().format();
    let givenComment = {text: "테스트 코멘트", author: "테스트 코맨트 작성자", cdate: now, udate: now};
    let whereArticle = {title: "아티클1"}
    // when
    Article.findOne<Article>({where: whereArticle}).then((findArticle: Article) => {
        commentSave(givenComment, findArticle,(saveComment: Comment) => {
            //then
            expect(saveComment.text).to.be.eq(givenComment.text);
            expect(saveComment.author).to.be.eq(givenComment.author);
            done();
        });
    });
  });

  it("아티클의 코맨트를 조회하면 코맨트 목록이 나온다.", (done: Function) => {
    //given
    let whereArticle = {title: "아티클1"}
    //when
    Comment.findAll<Comment>({include: [{model: Article, where: whereArticle}]}).then((comments: Comment[]) => {
      //then
      expect(comments).to.be.length(2);
      done();
    });
  });

});