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

	// operations
    int acquireId();
    bool releaseId(int id);
    bool isIdAvailable();
    
private:
	// resources
	LinkedPointerList<int> availableIds;

	// variables
	int maxSize;
};

#endif /* ID_MANAGER_H_ */
