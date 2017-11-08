import {expect} from "chai";
import {sequelize} from "../../../app/src/models/index";
import Category from "../../../app/src/models/domain/category";
import * as moment from "moment";

describe("[Integration] 카테고리 모델을 테스트 한다.", () => {
  moment.locale("ko-KR");

  const cleanUp = (cb: Function) => Category.destroy({where: {}, truncate: true}).then(() => cb());
  const categorySave = (given: Object, cb: Function) => {
    const category = new Category(given);
    category.save()
      .then((saveCategory: Category) => {
        cb(saveCategory);
      });
  };
  const categoryDestroy = (where: Object, cb: Function) => {
    Category.findOne(where).then((category: Category) => {
      category.destroy().then(() => {
        cb();
      });
    });
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

      let saveCategory = {name: "자유게시판", description: "자유롭게 글을 작성하세요.", cdate: now, udate: now};
      categorySave(saveCategory, () => {
        done();
      });
    });

  });


  it("카테고리를 등록할 때 등록한 값이 리턴된다.", (done: Function) => {
    //given
    const now = moment.utc().format();
    let givenCategory = {name: "자유게시판", description: "자유롭게 글을 작성하세요.", cdate: now, udate: now};

    // when
    categorySave(givenCategory, (saveCategory: Category) => {
      //then
      expect(saveCategory.name).to.be.eql(givenCategory.name);
      expect(saveCategory.description).to.be.eql(givenCategory.description);
      done();
    });
  });

  it("카테고리를 조회하면 카테고리 목록이 나온다.", (done: Function) => {
    //given
    //when
    Category.findAll<Category>().then((categories: Category[]) => {
      //then
      expect(categories.length).to.be.eqls(1);
      done();
    });

  });

  it("카테고리를 수정할 때 수정한 값이 리턴된다.", (done: Function) => {
    //given
    const now = moment.utc().format();
    let givenCategory = {name: "공지사항", description: "공지사항 입니다.", udate: now};

    //when
    Category.findOne<Category>({where: {name: "자유게시판"}})
      // then
      .then((category: Category) => {
        category.update(givenCategory).then((updatedCategory: Category) => {
          expect(updatedCategory.name).to.be.eql(givenCategory.name);
          expect(updatedCategory.description).to.be.eql(givenCategory.description);
          done();
        });
      });
  });

  it("카테고리를 검색하여 삭제한다.", (done: Function) => {
    //given
    let where = {name: "공지사항"};

    //when & then
    categoryDestroy(where, () => {
      Category.findOne({where: where}).then((findCategory: Category) => {
        expect(findCategory).to.be.eql(null);
        done();
      });
    });
  });
});