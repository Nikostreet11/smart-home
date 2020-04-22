#ifndef ID_MANAGER_H_
#define ID_MANAGER_H_

#include <LinkedPointerList.h>

class IdManager
{
public:
	// constructor
   IdManager(int maxIds);
     // destructor
    virtual ~IdManager();

    int acquireId();
    bool freeId(int id);
    bool isIdAvailable();
    
private:
	int maxIds;
	LinkedPointerList<int> freeIds;
};

#endif /* ID_MANAGER_H_ */
