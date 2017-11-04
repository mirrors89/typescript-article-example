import {expect} from "chai";
import {sequelize} from "../../../app/src/models/index";
import Category from "../../../app/src/models/domain/category";

describe("[Integration] 카테고리 모델을 테스트 한다.", () => {
	const cleanUp = (cb: Function) => Category.destroy({where: {}, truncate: true}).then(() => cb());  

  before((done: Function) => {
    sequelize.sync().then(() => {
      done();
    }).catch((error: Error) => {
        done(error);        
    });
  });
  
  beforeEach((done: Function) => {
    cleanUp(() => done());
  });

  it("카테고리를 등록할 때 등록한 값이 리턴된다", (done: Function) => {
    //given
    const now = new Date();
    let givenCategory = {name: "자유게시판", description: "자유롭게 글을 작성하세요.", cdate: now, udate: now}

    // //when
    const category = new Category(givenCategory);
    category.save()
      //then
      .then((saveCategory: Category) => {
        expect(saveCategory.name).to.be.eql(givenCategory.name);
        expect(saveCategory.description).to.be.eql(givenCategory.description);
        done();
      });

  });
});
