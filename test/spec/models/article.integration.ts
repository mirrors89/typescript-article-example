import {expect} from "chai";
import {sequelize} from "../../../app/src/models/index";
import Category from "../../../app/src/models/domain/category";
import Article from "../../../app/src/models/domain/article";
import * as moment from "moment";

describe("[Integration] 아티클 모델을 테스트 한다.", () => {
  moment.locale("ko");

  const cleanUp = (cb: Function) => Article.destroy({where: {}, truncate: true}).then(() => cb());

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
      const now = moment.utc().format();

      let saveCategory = {name: "자유게시판", description: "자유롭게 글을 작성하세요.", cdate: now, udate: now};
      categorySave(saveCategory, () => {
        done();
      });
    }).catch((error: Error) => {
      done(error);
    });
  });

  beforeEach((done: Function) => {
    cleanUp(() => done());
  });

  it("자유 게시판에 아티클을 등록할 때 등록한 값이 리턴된다.", (done: Function) => {
    // given
    const now = moment.utc().format();

    let where = {name: "자유게시판"};
    let givenArticle = {title: "글 제목", subject: "글내용", cdate: now, udate: now};

    // when
    Category.findOne<Category>({where: where}).then((findCategory: Category) => {
      articleSave(givenArticle, findCategory, (saveArticle: Article) => {

        Category.findOne<Category>({where: where, include: [Article]}).then((category: Category) => {
          // then
          expect(category.articles.length).to.be.eql(1);
          expect(saveArticle.title).to.be.eql(givenArticle.title);
          expect(saveArticle.subject).to.be.eql(givenArticle.subject);
          done();
        });
      });
    });
  });
});