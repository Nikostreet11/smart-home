#ifndef ID_MANAGER_H_
#define ID_MANAGER_H_

#include <WString.h>
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
    int acquireId(int id);
    bool releaseId(int id);
    bool isIdAvailable();
	bool isIdAvailable(int id);
    
private:
	// resources
	LinkedPointerList<int> availableIds;

	// variables
	int maxSize;
};

#endif /* ID_MANAGER_H_ */
