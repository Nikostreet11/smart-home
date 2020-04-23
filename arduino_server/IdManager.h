#ifndef ID_MANAGER_H_
#define ID_MANAGER_H_

#include <LinkedPointerList.h>

class IdManager
{
public:
	// constructor
	IdManager(int maxSize);
	// destructor
    virtual ~IdManager();

    int acquireId();
    bool releaseId(int id);
    bool isIdAvailable();
    
private:
	int maxSize;
	LinkedPointerList<int> availableIds;
};

#endif /* ID_MANAGER_H_ */
