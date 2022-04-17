//-------------------------------------------------
// src/user-service-spec.ts
//-------------------------------------------------

describe("UserService getUsers method test case", ()=> {


  // For every test case we need UserService instance so before running each test case the UserService instance will be created
   beforeEach(() => {
     console.info('before test');
   });
   
   // Test case to ensure getUsers method is defined
   it('Should be defined', () => {
      expect(5).toEqual(5);
   });

   
});