import {expect} from "chai";
import {sequelize} from "../../../app/src/models/index";
import Category from "../../../app/src/models/domain/category";
import Article from "../../../app/src/models/domain/article";
import * as moment from "moment";

describe("[Integration] 아티클 모델을 테스트 한다.", () => {
  moment.locale("ko");

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

      categorySave(givenCategory, (saveCategory: Category) => {
        Article.bulkCreate<Article>(givenArticles).then((articels: Article[]) => {
          saveCategory.$add("article", articels);
          done();
        });
      });
    });
  });

  it("자유 게시판에 아티클 목록이 리턴된다.", (done: Function) => {
    // given
    // when
    Article.findAll<Article>().then((articles: Article[]) => {
      // then
      expect(articles).to.be.length(2);
      done();
    })
  });

  it("자유 게시판에 아티클을 등록할 때 등록한 값이 리턴된다.", (done: Function) => {
    // given
    const now = moment.utc().format();

    let where = {name: "자유게시판"};
    let givenArticle = {title: "글 제목", subject: "글내용", author: "작성자", cdate: now, udate: now};

    // when
    Category.findOne<Category>({where: where}).then((findCategory: Category) => {
      articleSave(givenArticle, findCategory, (saveArticle: Article) => {

        Category.findOne<Category>({where: where, include: [Article]}).then((category: Category) => {
          // then
          expect(saveArticle.title).to.be.eql(givenArticle.title);
          expect(saveArticle.subject).to.be.eql(givenArticle.subject);
          done();
        });
      });
    });
  });

  it("자유 게시판에 아티클1을 수정할 때 수정할 값이 리턴된다.", (done: Function) => {
    // given
    const now = moment.utc().format();
    let categoryWhere = {name: "자유게시판"};
    let articleWhere = {title: "아티클1"};
    let givenArticle = {title: "수정된 아티클", subject: "내용이 수정되었습니다.", udate: now};

    // when
    Category.findOne<Category>({where: categoryWhere}).then((findCategory: Category) => {
      Article.findOne<Article>({where: articleWhere, include:[{model: Category, where: {id: findCategory.id}}]}).then((findArticle: Article) => {
        findArticle.update(givenArticle).then((saveArticle: Article) => {
          expect(saveArticle.title).to.be.eql(givenArticle.title);
          expect(saveArticle.subject).to.be.eql(givenArticle.subject);
          done();
        });
      });
    });
  });

  it("자유 게시판에 글 제목 아티클을 삭제한다.", (done: Function) => {
    // given
    const now = moment.utc().format();
    let where = {name: "자유게시판"};
    let givenArticle = {title: "글 제목", subject: "글내용",  author: "작성자1", cdate: now, udate: now};

    // when
    Category.findOne<Category>({where: where}).then((findCategory: Category) => {
      articleSave(givenArticle, findCategory, (saveArticle: Article) => {
        saveArticle.destroy().then(() => {
          Article.findOne<Article>({where: {title: "글 제목"}}).then((findArticle:Article) => {
            expect(findArticle).to.be.eql(null);
            done();
          });
        });
      });
    });
  });
});